import { Injectable } from '@angular/core';
import { Tutorial } from '../models/tutorial.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl='http://tutoriallistbackendsql-env.eba-hmqrmjsb.us-east-1.elasticbeanstalk.com/api/tutorials';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  constructor(private httpClient: HttpClient) { 
  }

  getAll():Observable<Tutorial[]>{

    return this.httpClient.get<Tutorial[]>(baseUrl);
  }

  getById(id:any):Observable<Tutorial>{

    return this.httpClient.get(`${baseUrl}/${id}`);
  }

  createTutorial(tutorial:any):Observable<any>{
    return this.httpClient.post(baseUrl,tutorial);

  }

  updateTutorial(id:any, tutorial:any):Observable<any>{

    return this.httpClient.put(`${baseUrl}/${id}`,tutorial);
  }

  deleteTutorial(id:any):Observable<any>{

    return this.httpClient.delete(`${baseUrl}/${id}`)
  }

  deleteAllTutorials():Observable<any>{

    return this.httpClient.delete(baseUrl);
  
  }

  findbyTitle(title:any):Observable<Tutorial[]>{

    return this.httpClient.get<Tutorial[]>(`${baseUrl}?title=${title}`)
  }

  
}
