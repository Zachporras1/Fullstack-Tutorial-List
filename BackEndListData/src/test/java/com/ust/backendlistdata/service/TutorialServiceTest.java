package com.ust.backendlistdata.service;

import com.ust.backendlistdata.dto.TutorialRequest;
import com.ust.backendlistdata.dto.TutorialResponse;
import com.ust.backendlistdata.exception.ResourceNotFoundException;
import com.ust.backendlistdata.model.Tutorial;
import com.ust.backendlistdata.repository.TutorialRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TutorialServiceTest {

    @Mock
    private TutorialRepository tutorialRepository;

    @InjectMocks
    private TutorialService tutorialService;

    private Tutorial tutorial;
    private TutorialRequest request;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        tutorial = new Tutorial("Spring Boot", "Learn Spring Boot", false, "John");
        tutorial.setId(1L);

        request = new TutorialRequest();
        request.setTitle("Spring Boot");
        request.setDescription("Learn Spring Boot");
        request.setName("John");

        pageable = PageRequest.of(0, 10);
    }

    @Test
    void getAllTutorials_noTitleFilter_returnsAllTutorials() {
        Page<Tutorial> page = new PageImpl<>(List.of(tutorial));
        when(tutorialRepository.findAll(pageable)).thenReturn(page);

        Page<TutorialResponse> result = tutorialService.getAllTutorials(null, pageable);

        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Spring Boot");
        verify(tutorialRepository).findAll(pageable);
        verify(tutorialRepository, never()).findByTitleContaining(any(), any());
    }

    @Test
    void getAllTutorials_withTitleFilter_returnsFilteredTutorials() {
        Page<Tutorial> page = new PageImpl<>(List.of(tutorial));
        when(tutorialRepository.findByTitleContaining("Spring", pageable)).thenReturn(page);

        Page<TutorialResponse> result = tutorialService.getAllTutorials("Spring", pageable);

        assertThat(result.getTotalElements()).isEqualTo(1);
        verify(tutorialRepository).findByTitleContaining("Spring", pageable);
        verify(tutorialRepository, never()).findAll(pageable);
    }

    @Test
    void getTutorialById_exists_returnsTutorial() {
        when(tutorialRepository.findById(1L)).thenReturn(Optional.of(tutorial));

        TutorialResponse result = tutorialService.getTutorialById(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("Spring Boot");
        assertThat(result.getName()).isEqualTo("John");
    }

    @Test
    void getTutorialById_notFound_throwsResourceNotFoundException() {
        when(tutorialRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tutorialService.getTutorialById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void getPublishedTutorials_returnsOnlyPublished() {
        Tutorial published = new Tutorial("Published", "desc", true, "Jane");
        published.setId(2L);
        Page<Tutorial> page = new PageImpl<>(List.of(published));
        when(tutorialRepository.findByPublished(true, pageable)).thenReturn(page);

        Page<TutorialResponse> result = tutorialService.getPublishedTutorials(pageable);

        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).isPublished()).isTrue();
    }

    @Test
    void createTutorial_savesAndReturnsResponse() {
        when(tutorialRepository.save(any(Tutorial.class))).thenReturn(tutorial);

        TutorialResponse result = tutorialService.createTutorial(request);

        assertThat(result.getTitle()).isEqualTo("Spring Boot");
        assertThat(result.isPublished()).isFalse();
        verify(tutorialRepository).save(any(Tutorial.class));
    }

    @Test
    void updateTutorial_exists_updatesAndReturns() {
        TutorialRequest updateRequest = new TutorialRequest();
        updateRequest.setTitle("Updated Title");
        updateRequest.setDescription("Updated Desc");
        updateRequest.setName("Updated Name");
        updateRequest.setPublished(true);

        Tutorial updated = new Tutorial("Updated Title", "Updated Desc", true, "Updated Name");
        updated.setId(1L);

        when(tutorialRepository.findById(1L)).thenReturn(Optional.of(tutorial));
        when(tutorialRepository.save(any(Tutorial.class))).thenReturn(updated);

        TutorialResponse result = tutorialService.updateTutorial(1L, updateRequest);

        assertThat(result.getTitle()).isEqualTo("Updated Title");
        assertThat(result.isPublished()).isTrue();
    }

    @Test
    void updateTutorial_notFound_throwsResourceNotFoundException() {
        when(tutorialRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tutorialService.updateTutorial(99L, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void deleteTutorial_exists_deletesSuccessfully() {
        when(tutorialRepository.existsById(1L)).thenReturn(true);

        tutorialService.deleteTutorial(1L);

        verify(tutorialRepository).deleteById(1L);
    }

    @Test
    void deleteTutorial_notFound_throwsResourceNotFoundException() {
        when(tutorialRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> tutorialService.deleteTutorial(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");

        verify(tutorialRepository, never()).deleteById(any());
    }

    @Test
    void deleteAllTutorials_callsRepositoryDeleteAll() {
        tutorialService.deleteAllTutorials();

        verify(tutorialRepository).deleteAll();
    }
}
