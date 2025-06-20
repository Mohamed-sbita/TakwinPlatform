import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmploiDuTempsService {
  private baseUrl = 'http://127.0.0.1:3000/emplois-du-temps/';

  constructor(private http: HttpClient) {}

  // Basic CRUD operations
  create(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  list(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  byId(id: string): Observable<any> {
    return this.http.get(this.baseUrl + id);
  }
  details(id: string): Observable<any> {
    return this.http.get(this.baseUrl +'details/' + id);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put(this.baseUrl + id, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(this.baseUrl + id);
  }

  // Specialized method
  getByClasse(classeId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}classe/${classeId}`);
  }

  getByUser(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}user/${userId}`);
  }

  getByFormateur(formateurId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/formateur/${formateurId}`);
  }
}