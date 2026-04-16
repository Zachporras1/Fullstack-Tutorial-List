package com.ust.backendlistdata.service;

import com.ust.backendlistdata.dto.TutorialRequest;
import com.ust.backendlistdata.dto.TutorialResponse;
import com.ust.backendlistdata.exception.ResourceNotFoundException;
import com.ust.backendlistdata.model.Tutorial;
import com.ust.backendlistdata.repository.TutorialRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TutorialService {

    private static final Logger logger = LoggerFactory.getLogger(TutorialService.class);

    private final TutorialRepository tutorialRepository;

    public TutorialService(TutorialRepository tutorialRepository) {
        this.tutorialRepository = tutorialRepository;
    }

    @Transactional(readOnly = true)
    public Page<TutorialResponse> getAllTutorials(String title, Pageable pageable) {
        Page<Tutorial> page = (title == null)
                ? tutorialRepository.findAll(pageable)
                : tutorialRepository.findByTitleContaining(title, pageable);
        logger.debug("Fetched {} tutorials (title filter: {})", page.getTotalElements(), title);
        return page.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public TutorialResponse getTutorialById(long id) {
        Tutorial tutorial = tutorialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tutorial not found with id: " + id));
        return toResponse(tutorial);
    }

    @Transactional(readOnly = true)
    public Page<TutorialResponse> getPublishedTutorials(Pageable pageable) {
        Page<Tutorial> page = tutorialRepository.findByPublished(true, pageable);
        logger.debug("Fetched {} published tutorials", page.getTotalElements());
        return page.map(this::toResponse);
    }

    @Transactional
    public TutorialResponse createTutorial(TutorialRequest request) {
        Tutorial tutorial = new Tutorial(request.getTitle(), request.getDescription(), false, request.getName());
        Tutorial saved = tutorialRepository.save(tutorial);
        logger.info("Created tutorial with id: {}", saved.getId());
        return toResponse(saved);
    }

    @Transactional
    public TutorialResponse updateTutorial(long id, TutorialRequest request) {
        Tutorial tutorial = tutorialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tutorial not found with id: " + id));
        tutorial.setTitle(request.getTitle());
        tutorial.setDescription(request.getDescription());
        tutorial.setPublished(request.isPublished());
        tutorial.setName(request.getName());
        Tutorial saved = tutorialRepository.save(tutorial);
        logger.info("Updated tutorial with id: {}", id);
        return toResponse(saved);
    }

    @Transactional
    public void deleteTutorial(long id) {
        if (!tutorialRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tutorial not found with id: " + id);
        }
        tutorialRepository.deleteById(id);
        logger.info("Deleted tutorial with id: {}", id);
    }

    @Transactional
    public void deleteAllTutorials() {
        tutorialRepository.deleteAll();
        logger.info("Deleted all tutorials");
    }

    private TutorialResponse toResponse(Tutorial tutorial) {
        return new TutorialResponse(
                tutorial.getId(),
                tutorial.getTitle(),
                tutorial.getDescription(),
                tutorial.isPublished(),
                tutorial.getName()
        );
    }
}
