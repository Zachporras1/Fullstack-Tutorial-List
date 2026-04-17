import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { TutorialDetailsComponent } from './tutorial-details.component';
import { TutorialService } from 'src/app/services/tutorial.service';
import { ToastService } from 'src/app/services/toast.service';

const mockTutorial = { id: 1, title: 'Spring Boot', description: 'Learn Spring', published: false, name: 'John' };

describe('TutorialDetailsComponent', () => {
  let component: TutorialDetailsComponent;
  let fixture: ComponentFixture<TutorialDetailsComponent>;
  let tutorialSpy: jasmine.SpyObj<TutorialService>;
  let toastSpy: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    tutorialSpy = jasmine.createSpyObj('TutorialService', ['getById', 'updateTutorial', 'deleteTutorial']);
    toastSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);
    tutorialSpy.getById.and.returnValue(of(mockTutorial));

    await TestBed.configureTestingModule({
      declarations: [TutorialDetailsComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        { provide: TutorialService, useValue: tutorialSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorialDetailsComponent);
    component = fixture.componentInstance;
    component.viewMode = false;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should load tutorial by id on init when viewMode is false', fakeAsync(() => {
    tick();
    expect(tutorialSpy.getById).toHaveBeenCalledWith(1);
    expect(component.currentTutorial.title).toBe('Spring Boot');
  }));

  it('getTutorial should show error toast on failure', fakeAsync(() => {
    tutorialSpy.getById.and.returnValue(throwError(() => new Error('err')));
    component.getTutorial(1);
    tick();
    expect(toastSpy.error).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));

  it('updatePublished(true) should set published=true and show success toast', fakeAsync(() => {
    component.currentTutorial = { ...mockTutorial };
    tutorialSpy.updateTutorial.and.returnValue(of({ ...mockTutorial, published: true }));
    component.updatePublished(true);
    tick();
    expect(component.currentTutorial.published).toBeTrue();
    expect(toastSpy.success).toHaveBeenCalled();
  }));

  it('updatePublished should show error toast on failure', fakeAsync(() => {
    component.currentTutorial = { ...mockTutorial };
    tutorialSpy.updateTutorial.and.returnValue(throwError(() => new Error('err')));
    component.updatePublished(true);
    tick();
    expect(toastSpy.error).toHaveBeenCalled();
  }));

  it('deleteTutorial should not call service when confirm denied', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteTutorial();
    expect(tutorialSpy.deleteTutorial).not.toHaveBeenCalled();
  });

  it('deleteTutorial should delete and show success when confirmed', fakeAsync(() => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    spyOn(window, 'confirm').and.returnValue(true);
    component.currentTutorial = { ...mockTutorial };
    tutorialSpy.deleteTutorial.and.returnValue(of(undefined));
    component.deleteTutorial();
    tick();
    expect(tutorialSpy.deleteTutorial).toHaveBeenCalledWith(1);
    expect(toastSpy.success).toHaveBeenCalled();
  }));

  it('deleteTutorial should show error toast on failure', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.currentTutorial = { ...mockTutorial };
    tutorialSpy.deleteTutorial.and.returnValue(throwError(() => new Error('err')));
    component.deleteTutorial();
    tick();
    expect(toastSpy.error).toHaveBeenCalled();
  }));

  it('updateTutorial should show success toast and set message', fakeAsync(() => {
    component.currentTutorial = { ...mockTutorial };
    tutorialSpy.updateTutorial.and.returnValue(of(mockTutorial));
    component.updateTutorial();
    tick();
    expect(toastSpy.success).toHaveBeenCalled();
    expect(component.message).toContain('updated');
  }));

  it('updateTutorial should show error toast on failure', fakeAsync(() => {
    component.currentTutorial = { ...mockTutorial };
    tutorialSpy.updateTutorial.and.returnValue(throwError(() => new Error('err')));
    component.updateTutorial();
    tick();
    expect(toastSpy.error).toHaveBeenCalled();
  }));
});
