import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { ToastService } from 'src/app/services/toast.service';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToastComponent],
      providers: [ToastService]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show success toast message in DOM', fakeAsync(() => {
    toastService.success('Saved!');
    tick();
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Saved!');
    tick(3500);
  }));

  it('should show error toast with alert-danger class', fakeAsync(() => {
    toastService.error('Something went wrong');
    tick();
    fixture.detectChanges();
    const alertEl = fixture.nativeElement.querySelector('.alert-danger');
    expect(alertEl).toBeTruthy();
    tick(3500);
  }));

  it('dismiss() should remove toast from list', fakeAsync(() => {
    toastService.show('Dismiss me', 'info');
    tick();
    fixture.detectChanges();
    expect(component.toasts.length).toBe(1);
    component.dismiss(component.toasts[0].id);
    tick(3500);
    fixture.detectChanges();
    expect(component.toasts.length).toBe(0);
  }));

  it('should render multiple toasts', fakeAsync(() => {
    toastService.success('First');
    toastService.error('Second');
    tick();
    fixture.detectChanges();
    expect(component.toasts.length).toBe(2);
    tick(3500);
  }));
});
