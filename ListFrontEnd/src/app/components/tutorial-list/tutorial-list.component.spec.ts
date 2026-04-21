import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { TutorialListComponent } from './tutorial-list.component';
import { TutorialService } from 'src/app/services/tutorial.service';
import { ToastService } from 'src/app/services/toast.service';

const mockPage = {
  content: [
    { id: 1, title: 'Tutorial 1', description: 'desc', published: false, name: 'Alice' },
    { id: 2, title: 'Tutorial 2', description: 'desc', published: true, name: 'Bob' }
  ],
  totalElements: 2, totalPages: 1, size: 10, number: 0, first: true, last: true
};

describe('TutorialListComponent', () => {
  let component: TutorialListComponent;
  let fixture: ComponentFixture<TutorialListComponent>;
  let tutorialSpy: jasmine.SpyObj<TutorialService>;
  let toastSpy: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    tutorialSpy = jasmine.createSpyObj('TutorialService', ['getAll', 'findbyTitle', 'getPublished', 'deleteAllTutorials', 'deleteTutorial']);
    toastSpy = jasmine.createSpyObj('ToastService', ['success', 'error', 'info']);
    tutorialSpy.getAll.and.returnValue(of(mockPage));

    await TestBed.configureTestingModule({
      declarations: [TutorialListComponent],
      imports: [FormsModule],
      providers: [
        { provide: TutorialService, useValue: tutorialSpy },
        { provide: ToastService, useValue: toastSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should load tutorials on init from content array', fakeAsync(() => {
    tick(0);
    expect(component.tutorials.length).toBe(2);
    expect(component.totalElements).toBe(2);
  }));

  it('should set isLoading false after fetch', fakeAsync(() => {
    component.getTutorialList();
    tick();
    expect(component.isLoading).toBeFalse();
  }));

  it('should show error toast when load fails', fakeAsync(() => {
    tutorialSpy.getAll.and.returnValue(throwError(() => new Error('err')));
    component.getTutorialList();
    tick();
    expect(toastSpy.error).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));

  it('setActiveTutorial should set currentTutorial and index', () => {
    const t = mockPage.content[0];
    component.setActiveTutorial(t, 0);
    expect(component.currentTutorial).toEqual(t);
    expect(component.currentindex).toBe(0);
  });

  it('removeAllTutorials should abort if confirm denied', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.removeAllTutorials();
    expect(tutorialSpy.deleteAllTutorials).not.toHaveBeenCalled();
  });

  it('removeAllTutorials should delete and show success toast', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    tutorialSpy.deleteAllTutorials.and.returnValue(of(undefined));
    component.removeAllTutorials();
    tick();
    expect(tutorialSpy.deleteAllTutorials).toHaveBeenCalled();
    expect(toastSpy.success).toHaveBeenCalled();
  }));

  it('removeAllTutorials should show error toast on failure', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    tutorialSpy.deleteAllTutorials.and.returnValue(throwError(() => new Error('err')));
    component.removeAllTutorials();
    tick();
    expect(toastSpy.error).toHaveBeenCalled();
  }));

  it('deleteSingleTutorial should abort if confirm denied', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteSingleTutorial(1);
    expect(tutorialSpy.deleteTutorial).not.toHaveBeenCalled();
  });

  it('deleteSingleTutorial should delete and show success', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    tutorialSpy.deleteTutorial.and.returnValue(of(undefined));
    component.deleteSingleTutorial(1);
    tick();
    expect(tutorialSpy.deleteTutorial).toHaveBeenCalledWith(1);
    expect(toastSpy.success).toHaveBeenCalled();
  }));

  it('refreshList should reset title, page and activeFilter', fakeAsync(() => {
    component.title = 'test';
    component.currentPage = 3;
    component.activeFilter = 'published';
    component.refreshList();
    tick();
    expect(component.title).toBe('');
    expect(component.currentPage).toBe(0);
    expect(component.activeFilter).toBe('all');
  }));

  it('nextPage should increment page when not on last page', fakeAsync(() => {
    component.totalPages = 3;
    component.currentPage = 0;
    component.nextPage();
    tick();
    expect(component.currentPage).toBe(1);
  }));

  it('nextPage should not increment beyond last page', fakeAsync(() => {
    component.totalPages = 2;
    component.currentPage = 1;
    component.nextPage();
    tick();
    expect(component.currentPage).toBe(1);
  }));

  it('previousPage should decrement page', fakeAsync(() => {
    component.totalPages = 3;
    component.currentPage = 2;
    component.previousPage();
    tick();
    expect(component.currentPage).toBe(1);
  }));

  it('previousPage should not go below 0', fakeAsync(() => {
    component.currentPage = 0;
    component.previousPage();
    tick();
    expect(component.currentPage).toBe(0);
  }));

  it('setFilter published should call getPublished', fakeAsync(() => {
    tutorialSpy.getPublished.and.returnValue(of(mockPage));
    component.setFilter('published');
    tick();
    expect(tutorialSpy.getPublished).toHaveBeenCalled();
    expect(component.activeFilter).toBe('published');
  }));

  it('setFilter all should call getAll', fakeAsync(() => {
    component.activeFilter = 'published';
    component.setFilter('all');
    tick();
    expect(tutorialSpy.getAll).toHaveBeenCalled();
    expect(component.activeFilter).toBe('all');
  }));

  it('onSearchInput debounces and calls findbyTitle', fakeAsync(() => {
    tutorialSpy.findbyTitle.and.returnValue(of(mockPage));
    component.onSearchInput('Spring');
    tick(300);
    expect(tutorialSpy.findbyTitle).toHaveBeenCalledWith('Spring', 0, 10);
  }));

  it('onSearchInput with empty string reloads all tutorials', fakeAsync(() => {
    const callsBefore = tutorialSpy.getAll.calls.count();
    component.onSearchInput('');
    tick(300);
    expect(tutorialSpy.getAll.calls.count()).toBeGreaterThan(callsBefore);
  }));
});
