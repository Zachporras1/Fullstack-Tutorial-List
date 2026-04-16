import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('show() should add a toast', () => {
    service.show('Hello', 'info');
    service.toasts$.subscribe(toasts => {
      expect(toasts.length).toBe(1);
      expect(toasts[0].message).toBe('Hello');
      expect(toasts[0].type).toBe('info');
    });
  });

  it('success() should add a success toast', () => {
    service.success('Done!');
    service.toasts$.subscribe(toasts => {
      expect(toasts[0].type).toBe('success');
    });
  });

  it('error() should add an error toast', () => {
    service.error('Oops!');
    service.toasts$.subscribe(toasts => {
      expect(toasts[0].type).toBe('error');
    });
  });

  it('dismiss() should remove the toast by id', () => {
    service.show('To dismiss', 'info');
    let id: number;
    service.toasts$.subscribe(toasts => { if (toasts.length) id = toasts[0].id; });
    service.dismiss(id!);
    service.toasts$.subscribe(toasts => expect(toasts.length).toBe(0));
  });

  it('toast should auto-dismiss after 3500ms', fakeAsync(() => {
    service.show('Auto', 'info');
    let count = 0;
    service.toasts$.subscribe(toasts => count = toasts.length);
    expect(count).toBe(1);
    tick(3500);
    expect(count).toBe(0);
  }));
});
