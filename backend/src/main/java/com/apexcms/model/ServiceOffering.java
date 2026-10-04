package com.apexcms.model;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

/** Named ServiceOffering to avoid clashing with Spring's @Service annotation. Exposed at /api/services. */
@Entity
@Table(name = "services")
@Getter
@Setter
public class ServiceOffering extends BaseContent {
    @Column(name = "service_number")
    private String number;

    @NotBlank
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> deliverables = new ArrayList<>();

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> technologies = new ArrayList<>();
}
