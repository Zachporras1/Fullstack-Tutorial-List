import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page, Tutorial } from '../models/tutorial.model';
import { environment } from 'src/environments/environment';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  constructor(private http: HttpClient) {}

  getAll(page = 0, size = 10): Observable<Page<Tutorial>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Tutorial>>(baseUrl, { params });
  }

  getById(id: number): Observable<Tutorial> {
    return this.http.get<Tutorial>(`${baseUrl}/${id}`);
  }

  getPublished(page = 0, size = 10): Observable<Page<Tutorial>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Tutorial>>(`${baseUrl}/published`, { params });
  }

  createTutorial(tutorial: Omit<Tutorial, 'id'>): Observable<Tutorial> {
    return this.http.post<Tutorial>(baseUrl, tutorial);
  }

  updateTutorial(id: number, tutorial: Partial<Tutorial>): Observable<Tutorial> {
    return this.http.put<Tutorial>(`${baseUrl}/${id}`, tutorial);
  }

  deleteTutorial(id: number): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/${id}`);
  }

  deleteAllTutorials(): Observable<void> {
    return this.http.delete<void>(baseUrl);
  }

  findbyTitle(title: string, page = 0, size = 10): Observable<Page<Tutorial>> {
    const params = new HttpParams().set('title', title).set('page', page).set('size', size);
    return this.http.get<Page<Tutorial>>(baseUrl, { params });
  }
}
