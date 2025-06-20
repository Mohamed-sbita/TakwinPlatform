import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AttendanceService } from '../../../../core/services/attendance.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatiereService } from '../../../../core/services/matiere.service';
import { GroupeService } from '../../../../core/services/groupe.service';
import { UserService } from '../../../../core/services/user.service';
import { AuthenticationService } from '../../../../core/auth/authentication.service';

@Component({
  selector: 'app-create-session',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
  templateUrl: './create-session.component.html',
  styleUrl: './create-session.component.css'
})
export class CreateSessionComponent {
  
  sessionForm: FormGroup;
  matieres: any[] = [];
  groupes: any[] = [];
  isLoading = false;

  creneauxHoraires = [
    { heureDebut: '08:30', heureFin: '10:00' },
    { heureDebut: '10:15', heureFin: '11:45' },
    { heureDebut: '12:00', heureFin: '13:30' },
    { heureDebut: '14:30', heureFin: '16:00' },
    { heureDebut: '16:15', heureFin: '17:45' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private attendanceService: AttendanceService,
    private matiereService: MatiereService,
    private groupeService: GroupeService,
    private _user: AuthenticationService,
    private router: Router
  ) {
    this.sessionForm = this.fb.group({
      matiere: ['', Validators.required],
      groupe: ['', Validators.required],
      creneau: ['', Validators.required],
      date: [new Date().toISOString().substring(0, 10), Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadFormData();
  }

  loadFormData(): void {
    this.isLoading = true;
    
    // Load matieres (subjects)
    this.matiereService.list().subscribe({
      next: (matieres: any) => {
        this.matieres = matieres;
      },
      error: (err) => {
        console.error('Error loading matieres:', err);
      }
    });

    // Load groupes
    this.groupeService.list().subscribe({
      next: (groupes: any) => {
        this.groupes = groupes;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading groupes:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.sessionForm.valid) {
      this.isLoading = true;
      
      // Format the date properly for the backend
      const formData = {
        ...this.sessionForm.value,
        formateur: this._user.getDataFromToken()._id,
        date: new Date(this.sessionForm.value.date).toISOString()
      };

      this.attendanceService.createSession(formData).subscribe({
        next: (session) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard/sessions']);
        },
        error: (error) => {
          console.error('Error creating session:', error);
          this.isLoading = false;
          alert('Error creating session. Please try again.');
        }
      });
    } else {
      this.markFormGroupTouched(this.sessionForm);
    }
  }

  // Helper to mark all fields as touched to show validation messages
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }


}
