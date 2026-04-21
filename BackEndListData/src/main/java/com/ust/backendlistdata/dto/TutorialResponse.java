package com.ust.backendlistdata.dto;

public class TutorialResponse {

    private Long id;
    private String title;
    private String description;
    private boolean published;
    private String name;

    public TutorialResponse() {
    }

    public TutorialResponse(Long id, String title, String description, boolean published, String name) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.published = published;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
