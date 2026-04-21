package com.ust.backendlistdata.repository;

import com.ust.backendlistdata.model.Tutorial;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class TutorialRepositoryTest {

    @Autowired
    private TutorialRepository tutorialRepository;

    private Pageable pageable;

    @BeforeEach
    void setUp() {
        tutorialRepository.deleteAll();
        pageable = PageRequest.of(0, 10);
    }

    @Test
    void save_persistsTutorial() {
        Tutorial tutorial = new Tutorial("Spring Boot", "Learn Spring", false, "John");

        Tutorial saved = tutorialRepository.save(tutorial);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getTitle()).isEqualTo("Spring Boot");
    }

    @Test
    void findById_existingId_returnsTutorial() {
        Tutorial saved = tutorialRepository.save(new Tutorial("JPA", "Learn JPA", false, "Jane"));

        Optional<Tutorial> found = tutorialRepository.findById(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getTitle()).isEqualTo("JPA");
    }

    @Test
    void findById_nonExistingId_returnsEmpty() {
        Optional<Tutorial> found = tutorialRepository.findById(999L);

        assertThat(found).isEmpty();
    }

    @Test
    void findByPublished_returnsOnlyPublishedTutorials() {
        tutorialRepository.save(new Tutorial("Published One", "desc", true, "Alice"));
        tutorialRepository.save(new Tutorial("Published Two", "desc", true, "Bob"));
        tutorialRepository.save(new Tutorial("Draft", "desc", false, "Carol"));

        Page<Tutorial> published = tutorialRepository.findByPublished(true, pageable);

        assertThat(published.getTotalElements()).isEqualTo(2);
        assertThat(published.getContent()).allMatch(Tutorial::isPublished);
    }

    @Test
    void findByPublished_nonePublished_returnsEmpty() {
        tutorialRepository.save(new Tutorial("Draft", "desc", false, "Dave"));

        Page<Tutorial> published = tutorialRepository.findByPublished(true, pageable);

        assertThat(published.getTotalElements()).isEqualTo(0);
    }

    @Test
    void findByTitleContaining_matchingTitle_returnsTutorials() {
        tutorialRepository.save(new Tutorial("Spring Boot Guide", "desc", false, "Eve"));
        tutorialRepository.save(new Tutorial("Spring MVC", "desc", false, "Frank"));
        tutorialRepository.save(new Tutorial("Angular Tutorial", "desc", false, "Grace"));

        Page<Tutorial> result = tutorialRepository.findByTitleContaining("Spring", pageable);

        assertThat(result.getTotalElements()).isEqualTo(2);
        assertThat(result.getContent()).allMatch(t -> t.getTitle().contains("Spring"));
    }

    @Test
    void findByTitleContaining_noMatch_returnsEmpty() {
        tutorialRepository.save(new Tutorial("Angular", "desc", false, "Hank"));

        Page<Tutorial> result = tutorialRepository.findByTitleContaining("React", pageable);

        assertThat(result.getTotalElements()).isEqualTo(0);
    }

    @Test
    void deleteById_removesToutorial() {
        Tutorial saved = tutorialRepository.save(new Tutorial("To Delete", "desc", false, "Ivy"));

        tutorialRepository.deleteById(saved.getId());

        assertThat(tutorialRepository.findById(saved.getId())).isEmpty();
    }

    @Test
    void deleteAll_removesAllTutorials() {
        tutorialRepository.save(new Tutorial("One", "desc", false, "Jack"));
        tutorialRepository.save(new Tutorial("Two", "desc", false, "Kate"));

        tutorialRepository.deleteAll();

        assertThat(tutorialRepository.findAll()).isEmpty();
    }

    @Test
    void existsById_existingId_returnsTrue() {
        Tutorial saved = tutorialRepository.save(new Tutorial("Exists", "desc", false, "Leo"));

        assertThat(tutorialRepository.existsById(saved.getId())).isTrue();
    }

    @Test
    void existsById_nonExistingId_returnsFalse() {
        assertThat(tutorialRepository.existsById(999L)).isFalse();
    }

    @Test
    void findAll_withPageable_returnsPaginatedResults() {
        for (int i = 1; i <= 5; i++) {
            tutorialRepository.save(new Tutorial("Tutorial " + i, "desc", false, "Author"));
        }

        Page<Tutorial> firstPage = tutorialRepository.findAll(PageRequest.of(0, 2));

        assertThat(firstPage.getTotalElements()).isEqualTo(5);
        assertThat(firstPage.getContent()).hasSize(2);
        assertThat(firstPage.getTotalPages()).isEqualTo(3);
    }
}
