package com.apexcms.service;

import com.apexcms.config.AppProperties;
import com.apexcms.exception.ResourceNotFoundException;
import com.apexcms.model.ContactMessage;
import com.apexcms.repository.MessageRepository;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactService {
    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final MessageRepository repository;
    private final ObjectProvider<JavaMailSender> mailSender; // absent when SPRING_MAIL_HOST is not configured
    private final AppProperties props;

    public ContactService(MessageRepository repository, ObjectProvider<JavaMailSender> mailSender, AppProperties props) {
        this.repository = repository;
        this.mailSender = mailSender;
        this.props = props;
    }

    /** Saves the message first (so nothing is lost), then tries to email it. An email failure never fails the request. */
    public ContactMessage submit(String name, String email, String subject, String body) {
        ContactMessage message = new ContactMessage();
        message.setName(name.trim());
        message.setEmail(email.trim());
        message.setSubject(subject == null || subject.isBlank() ? "(no subject)" : subject.trim());
        message.setMessage(body.trim());
        ContactMessage saved = repository.save(message);
        sendEmail(saved);
        return saved;
    }

    public List<ContactMessage> list() {
        return repository.findAllByOrderBySubmittedAtDesc();
    }

    public ContactMessage markRead(Long id, boolean read) {
        ContactMessage message = find(id);
        message.setRead(read);
        return repository.save(message);
    }

    public void delete(Long id) {
        repository.delete(find(id));
    }

    private ContactMessage find(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message " + id + " not found"));
    }

    private void sendEmail(ContactMessage message) {
        JavaMailSender sender = mailSender.getIfAvailable();
        String to = props.mail().to();
        if (sender == null || to == null || to.isBlank()) {
            return;
        }
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(props.mail().from());
            mail.setTo(to);
            mail.setReplyTo(message.getEmail());
            // Strip line breaks from user-supplied text used in headers (prevents email header injection).
            mail.setSubject("[Portfolio] " + message.getSubject().replaceAll("[\\r\\n]+", " "));
            mail.setText("From: " + message.getName() + " <" + message.getEmail() + ">\n\n" + message.getMessage());
            sender.send(mail);
        } catch (Exception e) {
            log.warn("Contact email could not be sent (message {} is saved in the database)", message.getId(), e);
        }
    }
}
