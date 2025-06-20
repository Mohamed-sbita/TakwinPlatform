import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../../../core/services/attendance.service';
import { MatiereService } from '../../../../core/services/matiere.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-admin-presence-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-absences.component.html',
  styleUrls: ['./admin-absences.component.css']
})
export class AdminPresenceManagementComponent implements OnInit {
  presenceRecords: any[] = [];
  filteredRecords: any[] = [];
  isLoading = true;
  errorMessage = '';
  
  // Filters
  filters = {
    startDate: '',
    endDate: '',
    formateurId: '',
    stagiaireId: '',
    matiereId: '',
    status: 'all'
  };
  
  // Dropdown options
  formateurs: any[] = [];
  stagiaires: any[] = [];
  matieres: any[] = [];
  statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'present', label: 'Présent' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Retard' },
    { value: 'excused', label: 'Excusé' }
  ];

  constructor(
    private attendanceService: AttendanceService,
    private matiereService: MatiereService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.isLoading = true;
    try {
      // Load presence records
      const records = await this.attendanceService.getAllPresenceRecords().toPromise();
      this.presenceRecords = records || [];
      this.filteredRecords = [...this.presenceRecords];
      

      this.matiereService.list().subscribe({
        next: (res: any)=>{
          this.matieres = res;
        }
      })
      this.isLoading = false;
    } catch (err) {
      this.isLoading = false;
      this.errorMessage = 'Erreur lors du chargement des données';
      console.error(err);
    }
  }

  applyFilters(): void {
    this.filteredRecords = this.presenceRecords.filter(record => {
      // Date filter
      if (this.filters.startDate && this.filters.endDate) {
        const recordDate = new Date(record.session.date);
        const startDate = new Date(this.filters.startDate);
        const endDate = new Date(this.filters.endDate);
        
        if (recordDate < startDate || recordDate > endDate) {
          return false;
        }
      }
      
      // Formateur filter
      if (this.filters.formateurId && record.session.formateur._id !== this.filters.formateurId) {
        return false;
      }
      
      // Stagiaire filter
      if (this.filters.stagiaireId && record.stagiaire._id !== this.filters.stagiaireId) {
        return false;
      }
      
      // Matiere filter
      if (this.filters.matiereId && record.session.matiere._id !== this.filters.matiereId) {
        return false;
      }
      
      // Status filter
      if (this.filters.status !== 'all' && record.status !== this.filters.status) {
        return false;
      }
      
      return true;
    });
  }

  resetFilters(): void {
    this.filters = {
      startDate: '',
      endDate: '',
      formateurId: '',
      stagiaireId: '',
      matiereId: '',
      status: 'all'
    };
    this.filteredRecords = [...this.presenceRecords];
  }

  exportToExcel(): void {
    // Implement export logic here
    console.log('Exporting to Excel:', this.filteredRecords);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'present': return 'badge bg-success';
      case 'absent': return 'badge bg-danger';
      case 'late': return 'badge bg-warning text-dark';
      case 'excused': return 'badge bg-info';
      default: return 'badge bg-secondary';
    }
  }
}