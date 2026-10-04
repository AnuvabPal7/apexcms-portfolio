package com.apexcms.model;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class Stats {
    private int yearsExperience;
    private int shippedProjects;
    private int githubContributions;
    private int clientSatisfactionRate;
}
