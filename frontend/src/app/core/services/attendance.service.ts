import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Session {
  _id?: string;
  matiere: string;
  date: Date;
  formateur: string;
  groupe: string;
  creneau: string;
}

interface AttendanceRecord {
  stagiaire: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

interface AttendanceResponse {
  session: any;
  attendance: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private baseUrl = 'http://127.0.0.1:3000/attendance/';
  
  constructor(private http: HttpClient) {}

  // Create a new session
  createSession(sessionData: {
    matiere: string;
    groupe: string;
    creneau: string;
  }): Observable<Session> {
    return this.http.post<Session>(`${this.baseUrl}sessions`, sessionData);
  }

  // Get all sessions for current formateur
  getFormateurSessions(id: any): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.baseUrl}sessions/me/` + id);
  }

  // Mark attendance for multiple stagiaires
  markAttendance(sessionId: string, records: AttendanceRecord[], id: any): Observable<any> {
    return this.http.post(`${this.baseUrl}mark`, {
      sessionId,
      attendanceRecords: records,
      id
    });
  }

  // Get attendance for a specific session
  getSessionAttendance(sessionId: string, id: any): Observable<AttendanceResponse> {
    return this.http.get<AttendanceResponse>(`${this.baseUrl}session/${sessionId}/${id}`);
  }

  // Get stagiaires for a groupe (to populate attendance form)
  getGroupeStagiaires(groupeId: string): Observable<any[]> {
    // This would use your existing groupe service or user service
    return this.http.get<any[]>(`http://127.0.0.1:3000/groupes/${groupeId}/stagiaires`);
  }

  // Get attendance statistics for a stagiaire
  getStagiaireAttendance(stagiaireId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}stats/stagiaire/${stagiaireId}`);
  }

  // Get attendance statistics for a groupe
  getGroupeAttendance(groupeId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}stats/groupe/${groupeId}`);
  }

  // Export attendance data
  exportAttendance(params: {
    startDate?: string;
    endDate?: string;
    matiere?: string;
    groupe?: string;
  }): Observable<Blob> {
    return this.http.get(`${this.baseUrl}export`, {
      params,
      responseType: 'blob'
    });
  }


  getStagiaireAbsences(stagiaireId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/stagiaire/${stagiaireId}`);
  }

  getAllPresenceRecords(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/admin/presence`);
  }
}