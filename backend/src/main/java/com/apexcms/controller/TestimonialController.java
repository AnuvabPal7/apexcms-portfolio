package com.apexcms.controller;

import com.apexcms.model.Testimonial;
import com.apexcms.repository.TestimonialRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/testimonials")
public class TestimonialController extends ContentController<Testimonial> {
    public TestimonialController(TestimonialRepository repository) {
        super(repository);
    }
}
