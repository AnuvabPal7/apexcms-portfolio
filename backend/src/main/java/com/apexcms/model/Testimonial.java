package com.apexcms.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "testimonials")
@Getter
@Setter
public class Testimonial extends BaseContent {
    @NotBlank
    private String clientName;

    @Column(name = "client_role")
    private String role;

    private String company;
    private String avatarUrl;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String quote;

    private String projectWorkedOn;
    private String outcomeMetric;

    @Min(1) @Max(5)
    private int rating = 5;
}
