import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttestationService {
  private baseUrl = 'http://localhost:3000/attestations';

  constructor(private http: HttpClient) { }

  // Create a new attestation request
  createRequest(userId: string): Observable<any> {
    return this.http.post(this.baseUrl, { userId });
  }

  // Get all requests (for admin)
  getAllRequests(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // Update request status (for admin)
  updateRequest(id: string, status: string, comment: string = ''): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, { status, adminComment: comment });
  }

  // Get requests for a specific user
  getUserRequests(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`);
  }

  // Get request statuses as human-readable text
  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'En attente',
      'approved': 'Approuvée',
      'rejected': 'Rejetée'
    };
    return statusMap[status] || status;
  }

  // Get status color for UI
  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'pending': 'warning',
      'approved': 'success',
      'rejected': 'danger'
    };
    return colorMap[status] || 'secondary';
  }
}