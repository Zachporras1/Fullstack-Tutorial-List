import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TutorialService } from './tutorial.service';
import { environment } from 'src/environments/environment';

const baseUrl = environment.apiUrl;

const emptyPage = { content: [], totalElements: 0, totalPages: 0, size: 10, number: 0, first: true, last: true };
const mockTutorial = { id: 1, title: 'Spring Boot', description: 'Learn Spring', published: false, name: 'John' };

describe('TutorialService', () => {
  let service: TutorialService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(TutorialService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() should GET with page and size params', () => {
    service.getAll(0, 10).subscribe(data => expect(data).toEqual(emptyPage));
    const req = httpMock.expectOne(r => r.url === baseUrl && r.params.get('page') === '0' && r.params.get('size') === '10');
    expect(req.request.method).toBe('GET');
    req.flush(emptyPage);
  });

  it('getAll() uses default page=0 size=10', () => {
    service.getAll().subscribe();
    const req = httpMock.expectOne(r => r.url === baseUrl && r.method === 'GET');
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('10');
    req.flush(emptyPage);
  });

  it('getById() should GET by id', () => {
    service.getById(1).subscribe(data => expect(data).toEqual(mockTutorial));
    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTutorial);
  });

  it('getPublished() should GET /published with page params', () => {
    service.getPublished(0, 5).subscribe(data => expect(data).toEqual(emptyPage));
    const req = httpMock.expectOne(r => r.url === `${baseUrl}/published`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('size')).toBe('5');
    req.flush(emptyPage);
  });

  it('createTutorial() should POST with body', () => {
    const body = { title: 'New', description: 'Desc', name: 'Auth', published: false };
    service.createTutorial(body).subscribe(data => expect(data).toEqual(mockTutorial));
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush(mockTutorial);
  });

  it('updateTutorial() should PUT to correct URL', () => {
    const update = { title: 'Updated', published: true };
    service.updateTutorial(1, update).subscribe();
    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(update);
    req.flush({ ...mockTutorial, ...update });
  });

  it('deleteTutorial() should DELETE by id', () => {
    service.deleteTutorial(1).subscribe();
    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('deleteAllTutorials() should DELETE base URL', () => {
    service.deleteAllTutorials().subscribe();
    const req = httpMock.expectOne(r => r.url === baseUrl && r.method === 'DELETE');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('findbyTitle() should GET with title and page params', () => {
    service.findbyTitle('Spring', 0, 10).subscribe(data => expect(data).toEqual(emptyPage));
    const req = httpMock.expectOne(r => r.url === baseUrl && r.params.get('title') === 'Spring');
    expect(req.request.method).toBe('GET');
    req.flush(emptyPage);
  });
});
