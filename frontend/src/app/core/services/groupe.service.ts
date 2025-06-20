import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GroupeService {
  private baseUrl ='http://127.0.0.1:3000/groupes/';
  
  constructor(private http: HttpClient) {}

  // Create a new group
  create(data: { nom: string, idClasse: string }) {
    return this.http.post(this.baseUrl, data);
  }

  // Get all groups
  list() {
    return this.http.get(this.baseUrl);
  }

  // Get single group by ID
  byId(id: string) {
    return this.http.get(this.baseUrl + id);
  }

  // Update group
  update(id: string, data: { nom?: string, idClasse?: string }) {
    return this.http.put(this.baseUrl + id, data);
  }

  // Delete group
  delete(id: string) {
    return this.http.delete(this.baseUrl + id);
  }

  // Optional: Get groups by class
  getByClasse(classeId: string) {
    return this.http.get(`${this.baseUrl}byclasse/${classeId}`);
  }
}