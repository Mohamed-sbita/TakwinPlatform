import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = 'http://127.0.0.1:3000/stats';

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  private getRolePrefix(): string {
    const userData = this.authService.getDataFromToken();
    return userData?.role === 'admin' ? 'admin' : 'formateur';
  }

  getSummaryStats(): Observable<any> {
    const prefix = this.getRolePrefix();
    return this.http.get(`${this.apiUrl}/${prefix}/summary`);
  }

  getStudentDistribution(): Observable<any> {
    const prefix = this.getRolePrefix();
    return this.http.get(`${this.apiUrl}/${prefix}/student-distribution`);
  }

  getDepartmentDistribution(): Observable<any> {
    // Only admin has access to department distribution
    return this.http.get(`${this.apiUrl}/admin/department-distribution`);
  }

  getAttendanceTrend(): Observable<any> {
    const prefix = this.getRolePrefix();
    return this.http.get(`${this.apiUrl}/${prefix}/attendance-trend`);
  }
}