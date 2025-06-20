import { Component } from '@angular/core';
import { AttendanceService } from '../../../../core/services/attendance.service';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthenticationService } from '../../../../core/auth/authentication.service';

@Component({
  selector: 'app-list-session',
  standalone: true,
  imports: [RouterModule, DatePipe, CommonModule],
  templateUrl: './list-session.component.html',
  styleUrl: './list-session.component.css'
})
export class ListSessionComponent {
  sessions: any[] = [];
  isLoading = true;
  attendanceData: any[]= [];

  ok: boolean = false;

  constructor(private attendanceService: AttendanceService, private _user: AuthenticationService) {}

  ngOnInit(): void {
    this.loadSessions();
    console.log(this.attendanceData);
    
    
  }

  loadSessions(): void {
    this.isLoading = true;
    this.attendanceService.getFormateurSessions( this._user.getDataFromToken()._id ).subscribe(
      sessions => {
        this.sessions = sessions;
        this.isLoading = false;
        console.log('Sessions loaded:', this.sessions);
        // load attendance data for each session
        this.sessions.forEach(session => {  
          this.attendanceService.getSessionAttendance(session._id, this._user.getDataFromToken()._id).subscribe(
            attendance => {
              this.attendanceData.push(attendance);
            },
            error => {
              console.error('Error loading attendance for session:', session._id, error);
            }
          );
        });
        
      },
      error => {
        console.error('Error loading sessions:', error);
        this.isLoading = false;
      }
    );
  }
  hasAttendance(sessionId: string): boolean {
    // Trouver l'objet correspondant à la session
    const sessionRecord = this.attendanceData.find(item => item.session._id === sessionId);
  
    // Vérifier si l'objet existe et si son tableau attendance contient au moins un élément
    return !!sessionRecord && Array.isArray(sessionRecord.attendance) && sessionRecord.attendance.length > 0;
  }
  
  




  // deleteSession(sessionId: string): void {
  //   if (confirm('Are you sure you want to delete this session?')) {
  //     // You would need to add a delete method to your service
  //     // this.attendanceService.deleteSession(sessionId).subscribe(() => {
  //     //   this.loadSessions();
  //     // });
  //   }
  // }
}
