import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  private baseUrl =  'http://127.0.0.1:3000/classes/';
  
  constructor(private http: HttpClient) {}

  // Create a new class
  create(data: { nom: string, idDepartment: string }) {
    return this.http.post(this.baseUrl, data);
  }

  // Get all classes
  list() {
    return this.http.get(this.baseUrl);
  }

  // Get single class by ID
  byId(id: string) {
    return this.http.get(this.baseUrl + id);
  }

  // Update class
  update(id: string, data: { nom?: string, idDepartment?: string }) {
    return this.http.put(this.baseUrl + id, data);
  }

  // Delete class
  delete(id: string) {
    return this.http.delete(this.baseUrl + id);
  }

  // Optional methods
  getByDepartment(departmentId: string) {
    return this.http.get(`${this.baseUrl}bydepartment/${departmentId}`);
  }

  searchByName(name: string) {
    return this.http.get(`${this.baseUrl}search?name=${name}`);
  }
}