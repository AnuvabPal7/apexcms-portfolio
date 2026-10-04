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

@Entity
@Table(name = "experience")
@Getter
@Setter
public class Experience extends BaseContent {
    @NotBlank
    private String company;

    // Column names avoid SQL reserved words such as POSITION / TYPE / PERIOD.
    @NotBlank
    @Column(name = "job_position")
    private String position;

    @Column(name = "period_label")
    private String period;

    private String location;

    @Column(name = "employment_type")
    private String type;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> achievements = new ArrayList<>();

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> technologies = new ArrayList<>();
}
