package com.ust.backendlistdata.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ust.backendlistdata.dto.TutorialRequest;
import com.ust.backendlistdata.dto.TutorialResponse;
import com.ust.backendlistdata.exception.ResourceNotFoundException;
import com.ust.backendlistdata.service.TutorialService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TutorialController.class)
class TutorialControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TutorialService tutorialService;

    private TutorialResponse sampleResponse;
    private TutorialRequest validRequest;

    @BeforeEach
    void setUp() {
        sampleResponse = new TutorialResponse(1L, "Spring Boot", "Learn Spring", false, "John");

        validRequest = new TutorialRequest();
        validRequest.setTitle("Spring Boot");
        validRequest.setDescription("Learn Spring");
        validRequest.setName("John");
    }

    @Test
    void getAllTutorials_returnsList() throws Exception {
        Page<TutorialResponse> page = new PageImpl<>(List.of(sampleResponse));
        when(tutorialService.getAllTutorials(isNull(), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/tutorials"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Spring Boot"))
                .andExpect(jsonPath("$.content[0].name").value("John"));
    }

    @Test
    void getAllTutorials_emptyList_returnsNoContent() throws Exception {
        when(tutorialService.getAllTutorials(isNull(), any(Pageable.class))).thenReturn(Page.empty());

        mockMvc.perform(get("/api/tutorials"))
                .andExpect(status().isNoContent());
    }

    @Test
    void getAllTutorials_withTitleFilter_returnsFiltered() throws Exception {
        Page<TutorialResponse> page = new PageImpl<>(List.of(sampleResponse));
        when(tutorialService.getAllTutorials(eq("Spring"), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/tutorials").param("title", "Spring"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Spring Boot"));
    }

    @Test
    void getTutorialById_found_returnsTutorial() throws Exception {
        when(tutorialService.getTutorialById(1L)).thenReturn(sampleResponse);

        mockMvc.perform(get("/api/tutorials/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Spring Boot"));
    }

    @Test
    void getTutorialById_notFound_returns404() throws Exception {
        when(tutorialService.getTutorialById(99L)).thenThrow(new ResourceNotFoundException("Tutorial not found with id: 99"));

        mockMvc.perform(get("/api/tutorials/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Tutorial not found with id: 99"));
    }

    @Test
    void getPublishedTutorials_returnsList() throws Exception {
        TutorialResponse published = new TutorialResponse(2L, "Published", "desc", true, "Jane");
        Page<TutorialResponse> page = new PageImpl<>(List.of(published));
        when(tutorialService.getPublishedTutorials(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/tutorials/published"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].published").value(true));
    }

    @Test
    void createTutorial_validRequest_returnsCreated() throws Exception {
        when(tutorialService.createTutorial(any(TutorialRequest.class))).thenReturn(sampleResponse);

        mockMvc.perform(post("/api/tutorials")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Spring Boot"));
    }

    @Test
    void createTutorial_missingTitle_returns400() throws Exception {
        TutorialRequest invalid = new TutorialRequest();
        invalid.setName("John");

        mockMvc.perform(post("/api/tutorials")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors").isArray());
    }

    @Test
    void createTutorial_missingName_returns400() throws Exception {
        TutorialRequest invalid = new TutorialRequest();
        invalid.setTitle("Some Title");

        mockMvc.perform(post("/api/tutorials")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateTutorial_found_returnsUpdated() throws Exception {
        TutorialResponse updated = new TutorialResponse(1L, "Updated", "Updated desc", true, "John");
        when(tutorialService.updateTutorial(eq(1L), any(TutorialRequest.class))).thenReturn(updated);

        mockMvc.perform(put("/api/tutorials/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated"));
    }

    @Test
    void updateTutorial_notFound_returns404() throws Exception {
        when(tutorialService.updateTutorial(eq(99L), any(TutorialRequest.class)))
                .thenThrow(new ResourceNotFoundException("Tutorial not found with id: 99"));

        mockMvc.perform(put("/api/tutorials/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteTutorial_found_returnsNoContent() throws Exception {
        doNothing().when(tutorialService).deleteTutorial(1L);

        mockMvc.perform(delete("/api/tutorials/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteTutorial_notFound_returns404() throws Exception {
        doThrow(new ResourceNotFoundException("Tutorial not found with id: 99"))
                .when(tutorialService).deleteTutorial(99L);

        mockMvc.perform(delete("/api/tutorials/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteAllTutorials_returnsNoContent() throws Exception {
        doNothing().when(tutorialService).deleteAllTutorials();

        mockMvc.perform(delete("/api/tutorials"))
                .andExpect(status().isNoContent());
    }
}
