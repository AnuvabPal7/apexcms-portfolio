package com.apexcms.controller;

import com.apexcms.model.ContactMessage;
import com.apexcms.service.ContactService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ContactController {

    public record ContactRequest(
            @NotBlank @Size(max = 100) String name,
            @NotBlank @Email @Size(max = 200) String email,
            @Size(max = 150) String subject,
            @NotBlank @Size(max = 5000) String message) {}

    /** Public confirmation only: we do not echo stored data back to anonymous visitors. */
    public record ContactResponse(String status) {}

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/contact")
    @ResponseStatus(HttpStatus.CREATED)
    public ContactResponse submit(@Valid @RequestBody ContactRequest request) {
        contactService.submit(request.name(), request.email(), request.subject(), request.message());
        return new ContactResponse("received");
    }

    // ---- Admin only (JWT required) ----

    @GetMapping("/messages")
    public List<ContactMessage> list() {
        return contactService.list();
    }

    @PatchMapping("/messages/{id}/read")
    public ContactMessage markRead(@PathVariable("id") Long id,
                                   @RequestParam(name = "value", defaultValue = "true") boolean value) {
        return contactService.markRead(id, value);
    }

    @DeleteMapping("/messages/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        contactService.delete(id);
    }
}
