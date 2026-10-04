package com.apexcms.controller;

import com.apexcms.model.Project;
import com.apexcms.repository.ProjectRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
public class ProjectController extends ContentController<Project> {
    public ProjectController(ProjectRepository repository) {
        super(repository);
    }
}
