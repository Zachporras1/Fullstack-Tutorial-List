package com.ust.backendlistdata.repository;

import com.ust.backendlistdata.model.Tutorial;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TutorialRepository extends JpaRepository<Tutorial, Long> {

    Page<Tutorial> findByPublished(boolean published, Pageable pageable);

    Page<Tutorial> findByTitleContaining(String title, Pageable pageable);
}
