package com.apexcms.repository;

import com.apexcms.model.ContactMessage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<ContactMessage, Long> {
    List<ContactMessage> findAllByOrderBySubmittedAtDesc();
}
