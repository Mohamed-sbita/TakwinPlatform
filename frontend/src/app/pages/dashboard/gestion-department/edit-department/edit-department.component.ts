import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DepartmentService } from '../../../../core/services/department.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-department',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.css']
})
export class EditDepartmentComponent implements OnInit {
  departmentForm: FormGroup;
  departmentId: string = '';

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.departmentForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.departmentId = this.route.snapshot.params['id'];
    this.loadDepartment();
  }

  loadDepartment(): void {
    this.departmentService.byId(this.departmentId).subscribe({
      next: (department: any) => {
        this.departmentForm.patchValue({
          nom: department.nom,
          description: department.description
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger le département'
        });
        this.router.navigate(['/dashboard/department']);
      }
    });
  }

  onSubmit(): void {
    if (this.departmentForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs obligatoires correctement'
      });
      return;
    }

    this.departmentService.update(this.departmentId, this.departmentForm.value).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Département mis à jour avec succès'
        });
        this.router.navigate(['/dashboard/department']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: err.error.message || 'Une erreur est survenue lors de la mise à jour'
        });
      }
    });
  }
}