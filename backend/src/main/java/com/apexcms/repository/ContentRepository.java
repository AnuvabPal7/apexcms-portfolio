package com.apexcms.repository;

import com.apexcms.model.BaseContent;
import com.apexcms.model.ContentStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface ContentRepository<T extends BaseContent> extends JpaRepository<T, Long> {
    List<T> findAllByOrderByDisplayOrderAsc();
    List<T> findByStatusOrderByDisplayOrderAsc(ContentStatus status);
}
