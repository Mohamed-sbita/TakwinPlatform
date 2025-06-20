import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:3000/user/';

  constructor(private http: HttpClient) {}

  // Create single user
  create(userData: {
    nom: string;
    prenom: string;
    email: string;
    password: string;
    tel: string;
    role: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}createuseraccount`, userData);
  }

  // Bulk create stagiaires from Excel
  bulkCreateStagiaires(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}bulk-create-stagiaires`, formData);
  }

  // User authentication
  signin(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}signin`, credentials);
  }

  // Get all users (excluding admin)
  list(): Observable<any> {
    return this.http.get(`${this.apiUrl}list`);
  }

  byGroupe(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}groupe/${id}`);
  }

  // Get user by ID
  byid(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}byid/${id}`);
  }

  // Delete user
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}delete/${id}`);
  }

  // Update user
  update(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}update/${id}`, userData);
  }

  // Password recovery
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}forgot-password`, { email });
  }

  // Password reset
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}reset-password/${token}`, { 
      password: newPassword 
    });
  }

  // Helper method to create FormData for bulk upload
  prepareBulkUploadData(
    file: File,
    idClasse: string,
    idGroupe: string
  ): FormData {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('idClasse', idClasse);
    formData.append('idGroupe', idGroupe);
    return formData;
  }
}