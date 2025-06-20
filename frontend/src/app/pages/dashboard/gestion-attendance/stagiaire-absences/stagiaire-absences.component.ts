import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../../../core/services/attendance.service';
import { AuthenticationService } from '../../../../core/auth/authentication.service';

@Component({
  selector: 'app-stagiaire-absences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stagiaire-absences.component.html',
  styleUrls: ['./stagiaire-absences.component.css']
})
export class StagiaireAbsencesComponent implements OnInit {
  absencesData: any = null;
  isLoading = true;
  errorMessage = '';
  statusFilter = 'all';
  dateRange = {
    start: '',
    end: ''
  };

  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadAbsences();
  }

  loadAbsences(): void {
    this.isLoading = true;
    const user = this.authService.getDataFromToken();
    
    if (!user?._id) {
      this.isLoading = false;
      this.errorMessage = "Utilisateur non identifié";
      return;
    }

    this.attendanceService.getStagiaireAbsences(user._id).subscribe({
      next: (data: any) => {
        this.absencesData = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement de vos absences';
        console.error(err);
      }
    });
  }

  get filteredAbsences() {
    if (!this.absencesData) return [];
    
    return this.absencesData.absences.filter((absence: any) => {
      // Filter by status
      let statusMatch = true;
      if (this.statusFilter !== 'all') {
        statusMatch = absence.status === this.statusFilter;
      }
      
      // Filter by date range
      let dateMatch = true;
      if (this.dateRange.start && this.dateRange.end) {
        const startDate = new Date(this.dateRange.start);
        const endDate = new Date(this.dateRange.end);
        const absenceDate = new Date(absence.date);
        dateMatch = absenceDate >= startDate && absenceDate <= endDate;
      }
      
      return statusMatch && dateMatch;
    });
  }

  resetFilters(): void {
    this.statusFilter = 'all';
    this.dateRange = { start: '', end: '' };
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'absent': return 'badge bg-danger';
      case 'late': return 'badge bg-warning text-dark';
      case 'excused': return 'badge bg-info';
      default: return 'badge bg-secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'absent': return 'Absent';
      case 'late': return 'Retard';
      case 'excused': return 'Excusé';
      default: return status;
    }
  }
}