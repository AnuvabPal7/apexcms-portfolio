package com.apexcms.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/** The single "About" record (always id = 1). */
@Entity
@Table(name = "about")
@Getter
@Setter
public class Profile {
    public static final long SINGLETON_ID = 1L;

    @Id
    private Long id = SINGLETON_ID;

    @NotBlank
    private String name;
    private String roleTitle;
    private String heroKicker;
    private String tagline;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(columnDefinition = "TEXT")
    private String extendedBio;

    private String location;
    private String email;
    private String phone;
    private String githubUrl;
    private String linkedinUrl;
    private String twitterUrl;
    private String resumeUrl;
    private String avatarUrl;
    private String availability;

    @Embedded
    private Stats stats = new Stats();
}
