package com.apexcms.repository;

import com.apexcms.model.MediaAsset;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MediaRepository extends JpaRepository<MediaAsset, Long> {
    List<MediaAsset> findAllByOrderByUploadedAtDesc();
}
