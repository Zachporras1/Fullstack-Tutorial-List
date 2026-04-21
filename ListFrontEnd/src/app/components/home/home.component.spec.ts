import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should render the hero title containing "Tutorial"', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent).toContain('Tutorial');
  });

  it('should render three feature cards', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.feature-card').length).toBe(3);
  });

  it('should contain a link to tutorials route', () => {
    const el: HTMLElement = fixture.nativeElement;
    const links = Array.from(el.querySelectorAll('a')) as HTMLAnchorElement[];
    const found = links.some(a => a.textContent?.includes('Tutorials') || a.getAttribute('routerlink')?.includes('tutorials'));
    expect(found).toBeTrue();
  });

  it('should contain a link to add route', () => {
    const el: HTMLElement = fixture.nativeElement;
    const links = Array.from(el.querySelectorAll('a')) as HTMLAnchorElement[];
    const found = links.some(a => a.textContent?.includes('Add') || a.getAttribute('routerlink')?.includes('add'));
    expect(found).toBeTrue();
  });
});
