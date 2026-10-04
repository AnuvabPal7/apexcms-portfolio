package com.apexcms.controller;

import com.apexcms.model.Experience;
import com.apexcms.repository.ExperienceRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/experience")
public class ExperienceController extends ContentController<Experience> {
    public ExperienceController(ExperienceRepository repository) {
        super(repository);
    }
}
