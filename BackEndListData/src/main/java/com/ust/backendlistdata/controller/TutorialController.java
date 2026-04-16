package com.ust.backendlistdata.controller;

import com.ust.backendlistdata.dto.TutorialRequest;
import com.ust.backendlistdata.dto.TutorialResponse;
import com.ust.backendlistdata.service.TutorialService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api")
public class TutorialController {

    private static final Logger logger = LoggerFactory.getLogger(TutorialController.class);

    private final TutorialService tutorialService;

    public TutorialController(TutorialService tutorialService) {
        this.tutorialService = tutorialService;
    }

    // Must be declared before /tutorials/{id} so Spring matches it first
    @GetMapping("/tutorials/published")
    public ResponseEntity<Page<TutorialResponse>> getPublishedTutorials(Pageable pageable) {
        logger.debug("GET /tutorials/published");
        Page<TutorialResponse> page = tutorialService.getPublishedTutorials(pageable);
        if (page.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(page);
    }

    @GetMapping("/tutorials")
    public ResponseEntity<Page<TutorialResponse>> getAllTutorials(
            @RequestParam(required = false) String title, Pageable pageable) {
        logger.debug("GET /tutorials (title={})", title);
        Page<TutorialResponse> page = tutorialService.getAllTutorials(title, pageable);
        if (page.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(page);
    }

    @GetMapping("/tutorials/{id}")
    public ResponseEntity<TutorialResponse> getTutorialById(@PathVariable long id) {
        logger.debug("GET /tutorials/{}", id);
        return ResponseEntity.ok(tutorialService.getTutorialById(id));
    }

    @PostMapping("/tutorials")
    public ResponseEntity<TutorialResponse> createTutorial(@Valid @RequestBody TutorialRequest request) {
        logger.debug("POST /tutorials");
        return ResponseEntity.status(HttpStatus.CREATED).body(tutorialService.createTutorial(request));
    }

    @PutMapping("/tutorials/{id}")
    public ResponseEntity<TutorialResponse> updateTutorial(
            @PathVariable long id, @Valid @RequestBody TutorialRequest request) {
        logger.debug("PUT /tutorials/{}", id);
        return ResponseEntity.ok(tutorialService.updateTutorial(id, request));
    }

    @DeleteMapping("/tutorials/{id}")
    public ResponseEntity<Void> deleteTutorial(@PathVariable long id) {
        logger.debug("DELETE /tutorials/{}", id);
        tutorialService.deleteTutorial(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/tutorials")
    public ResponseEntity<Void> deleteAllTutorials() {
        logger.debug("DELETE /tutorials");
        tutorialService.deleteAllTutorials();
        return ResponseEntity.noContent().build();
    }
}
