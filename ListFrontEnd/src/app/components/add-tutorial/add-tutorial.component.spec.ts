import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { of, throwError } from 'rxjs';
import { AddTutorialComponent } from './add-tutorial.component';
import { TutorialService } from 'src/app/services/tutorial.service';
import { ToastService } from 'src/app/services/toast.service';

const mockCreated = { id: 1, title: 'Test', description: 'Desc', name: 'Author', published: false };

describe('AddTutorialComponent', () => {
  let component: AddTutorialComponent;
  let fixture: ComponentFixture<AddTutorialComponent>;
  let tutorialSpy: jasmine.SpyObj<TutorialService>;
  let toastSpy: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    tutorialSpy = jasmine.createSpyObj('TutorialService', ['createTutorial']);
    toastSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [AddTutorialComponent],
      imports: [FormsModule],
      providers: [
        { provide: TutorialService, useValue: tutorialSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should initialize with empty fields and submitted=false', () => {
    expect(component.tutorial.title).toBe('');
    expect(component.tutorial.name).toBe('');
    expect(component.submitted).toBeFalse();
    expect(component.isLoading).toBeFalse();
  });

  it('saveTutorial should call createTutorial with correct data', fakeAsync(() => {
    tutorialSpy.createTutorial.and.returnValue(of(mockCreated));
    component.tutorial = { title: 'Test', description: 'Desc', name: 'Author' };
    component.saveTutorial();
    tick();
    expect(tutorialSpy.createTutorial).toHaveBeenCalledWith(
      jasmine.objectContaining({ title: 'Test', name: 'Author', published: false })
    );
  }));

  it('saveTutorial should set submitted=true and show success toast on success', fakeAsync(() => {
    tutorialSpy.createTutorial.and.returnValue(of(mockCreated));
    component.tutorial = { title: 'T', description: '', name: 'N' };
    component.saveTutorial();
    tick();
    expect(component.submitted).toBeTrue();
    expect(toastSpy.success).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));

  it('saveTutorial should show error toast and keep submitted=false on failure', fakeAsync(() => {
    tutorialSpy.createTutorial.and.returnValue(throwError(() => new Error('error')));
    component.tutorial = { title: 'T', description: '', name: 'N' };
    component.saveTutorial();
    tick();
    expect(component.submitted).toBeFalse();
    expect(toastSpy.error).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));

  it('saveTutorial should set isLoading=true while request is in flight', () => {
    const pending$ = new Subject<typeof mockCreated>();
    tutorialSpy.createTutorial.and.returnValue(pending$.asObservable());
    component.tutorial = { title: 'T', description: '', name: 'N' };
    component.saveTutorial();
    expect(component.isLoading).toBeTrue();
    pending$.complete();
  });

  it('newTutorial should reset form to initial state', () => {
    component.submitted = true;
    component.tutorial = { title: 'existing', name: 'someone' };
    component.newTutorial();
    expect(component.submitted).toBeFalse();
    expect(component.tutorial.title).toBe('');
    expect(component.tutorial.name).toBe('');
  });
});
