package com.apexcms.controller;

import com.apexcms.exception.ResourceNotFoundException;
import com.apexcms.model.Profile;
import com.apexcms.repository.ProfileRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/about")
public class AboutController {
    private final ProfileRepository repository;

    public AboutController(ProfileRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public Profile get() {
        return repository.findById(Profile.SINGLETON_ID)
                .orElseThrow(() -> new ResourceNotFoundException("About section has not been created yet"));
    }

    @PutMapping
    public Profile update(@Valid @RequestBody Profile body) {
        body.setId(Profile.SINGLETON_ID);
        return repository.save(body);
    }
}
