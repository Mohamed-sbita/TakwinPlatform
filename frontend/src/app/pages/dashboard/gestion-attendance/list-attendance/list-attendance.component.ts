import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AttendanceService } from '../../../../core/services/attendance.service';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../../core/auth/authentication.service';

@Component({
  selector: 'app-list-attendance',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-attendance.component.html',
  styleUrl: './list-attendance.component.css'
})
export class ListAttendanceComponent {
  sessionId: string;
  attendanceData: any;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private attendanceService: AttendanceService,
    private _user: AuthenticationService
  ) {
    this.sessionId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.loadAttendanceData();
  }

  loadAttendanceData(): void {
    this.isLoading = true;
    this.attendanceService.getSessionAttendance(this.sessionId, this._user.getDataFromToken()._id).subscribe({
      next: (data) => {
        this.attendanceData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading attendance data:', error);
        this.isLoading = false;
        alert('Error loading attendance data. Please try again.');
      }
    });
  }

  countStatus(status: string): number {
    if (!this.attendanceData?.attendance) return 0;
    return this.attendanceData.attendance.filter(
      (record: any) => record.status === status
    ).length;
  }

  getStatusPercentage(status: string): number {
    if (!this.attendanceData?.attendance?.length) return 0;
    return Math.round(
      (this.countStatus(status) / this.attendanceData.attendance.length) * 100
    );
  }

  getStatusLabel(status: string): string {
    const statusLabels: {[key: string]: string} = {
      'present': 'Présent',
      'absent': 'Absent',
      'late': 'En retard',
      'excused': 'Excusé'
    };
    return statusLabels[status] || status;
  }
  
  getStatusClass(status: string): string {
    return `badge-${status}`;
  }
}
