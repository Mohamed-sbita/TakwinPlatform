import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:3000/contact'; // Update with your backend URL

  constructor(private http: HttpClient) { }

  // Send a new contact message
  sendMessage(message: { name: string, email: string, subject: string, message: string }): Observable<any> {
    return this.http.post(this.apiUrl, message);
  }

  // Get all contact messages
  getMessages(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get a specific message by ID
  getMessage(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Delete a message by ID
  deleteMessage(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}