package com.apexcms.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "skills")
@Getter
@Setter
public class Skill extends BaseContent {
    @NotBlank
    private String name;
    private String category;
    @Min(0) @Max(100)
    private int proficiency;
    private int years;
    private boolean highlight;
}
