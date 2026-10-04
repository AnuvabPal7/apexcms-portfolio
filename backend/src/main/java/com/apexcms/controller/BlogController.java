package com.apexcms.controller;

import com.apexcms.model.Blog;
import com.apexcms.repository.BlogRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/blogs")
public class BlogController extends ContentController<Blog> {
    public BlogController(BlogRepository repository) {
        super(repository);
    }
}
