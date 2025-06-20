import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private baseUrl =  'http://127.0.0.1:3000/departments/';
  
  constructor(private http: HttpClient) {}

  // Create a new department
  create(data: { nom: string, description?: string }) {
    return this.http.post(this.baseUrl, data);
  }

  // Get all departments
  list() {
    return this.http.get(this.baseUrl);
  }

  // Get single department by ID
  byId(id: string) {
    return this.http.get(this.baseUrl + id);
  }

  // Update department
  update(id: string, data: { nom?: string, description?: string }) {
    return this.http.put(this.baseUrl + id, data);
  }

  // Delete department
  delete(id: string) {
    return this.http.delete(this.baseUrl + id);
  }

  // Optional methods you might implement later
  searchByName(name: string) {
    return this.http.get(this.baseUrl + 'search?name=' + name);
  }

  // If you implement pagination later
  listPaginated(page: number, limit: number) {
    return this.http.get(`${this.baseUrl}?page=${page}&limit=${limit}`);
  }
}