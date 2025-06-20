import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendanceService } from '../../../../core/services/attendance.service';
import { UserService } from '../../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../../core/auth/authentication.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-attendance.component.html',
  styleUrl: './create-attendance.component.css'
})
export class CreateAttendanceComponent {
  sessionId: string;
  stagiaires: any[] = [];
  attendanceRecords: any[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private attendanceService: AttendanceService,
    private userService: AuthenticationService,
    private _user: UserService,
    private routes : Router
  ) {
    this.sessionId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.loadSessionData();
  }

  getCurrentStatus(stagiaireId: string): string {
    const record = this.attendanceRecords.find(r => r.stagiaire._id === stagiaireId);
    return record ? record.status : 'absent';
  }

  loadSessionData(): void {
    this.attendanceService.getSessionAttendance(this.sessionId, this.userService.getDataFromToken()._id).subscribe({
      next: (data) => {
        this.stagiaires = data.attendance.map((a: any) => a.stagiaire);
        this.attendanceRecords = data.attendance;
        this.isLoading = false;

        if (this.stagiaires.length == 0) {
          this._user.byGroupe(data.session.groupe._id).subscribe({
            next: (res) => {
              this.stagiaires = res;
            },
            error: (err) => {
              Swal.fire({
                title: 'Erreur',
                text: 'Impossible de charger les étudiants du groupe',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          });
        }
      },
      error: (error) => {
        console.error('Error loading session data:', error);
        this.isLoading = false;
        Swal.fire({
          title: 'Erreur',
          text: 'Impossible de charger les données de la séance',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  updateAttendance(stagiaireId: string, e: any): void {
    const status = e.target.value;
    const record = this.attendanceRecords.find(r => r.stagiaire._id === stagiaireId);
    
    if (record) {
      record.status = status;
    } else {
      this.attendanceRecords.push({
        stagiaire: { _id: stagiaireId },
        status: status
      });
    }
  }

  submitAttendance(): void {
    const records = this.stagiaires.map(stagiaire => {
      const record = this.attendanceRecords.find(r => r.stagiaire._id === stagiaire._id);
      return {
        stagiaire: stagiaire._id,
        status: record ? record.status : 'absent'
      };
    });

    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment enregistrer ces présences ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, enregistrer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.attendanceService.markAttendance(this.sessionId, records, this.userService.getDataFromToken()._id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Succès',
              text: 'Les présences ont été enregistrées avec succès',
              icon: 'success',
              confirmButtonText: 'OK'
            });

            this.routes.navigate(['/dashboard/sessions']);

          },
          error: (error) => {
            console.error('Error saving attendance:', error);
            Swal.fire({
              title: 'Erreur',
              text: 'Une erreur est survenue lors de l\'enregistrement',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }
}