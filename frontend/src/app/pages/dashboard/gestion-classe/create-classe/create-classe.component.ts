import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ClasseService } from '../../../../core/services/classe.service';
import { DepartmentService } from '../../../../core/services/department.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-classe',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
  templateUrl: './create-classe.component.html',
  styleUrls: ['./create-classe.component.css']
})
export class CreateClasseComponent {
  classeForm: FormGroup;
  departments: any[] = [];

  constructor(
    private fb: FormBuilder,
    private classeService: ClasseService,
    private departmentService: DepartmentService,
    private router: Router
  ) {
    this.classeForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      idDepartment: ['', Validators.required]
    });
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.list().subscribe({
      next: (departments: any) => {
        this.departments = departments;
      },
      error: (err) => {
        console.error('Failed to load departments', err);
      }
    });
  }

  onSubmit(): void {
    if (this.classeForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs obligatoires correctement'
      });
      return;
    }

    this.classeService.create(this.classeForm.value).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Classe créée avec succès'
        });
        this.router.navigate(['/dashboard/classes']);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: err.error.message || 'Une erreur est survenue lors de la création'
        });
        console.error(err);
      }
    });
  }
}