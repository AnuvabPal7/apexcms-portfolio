package com.apexcms.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "media")
@Getter
@Setter
public class MediaAsset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;      // generated name on disk (never the user's filename)
    private String originalName;
    private String url;           // e.g. /uploads/3f2c...png
    private long size;
    private String mimeType;
    private Instant uploadedAt = Instant.now();
}
