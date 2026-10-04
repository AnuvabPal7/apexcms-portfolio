package com.apexcms.controller;

import com.apexcms.model.Skill;
import com.apexcms.repository.SkillRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/skills")
public class SkillController extends ContentController<Skill> {
    public SkillController(SkillRepository repository) {
        super(repository);
    }
}
