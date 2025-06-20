import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClasseService } from '../../../../core/services/classe.service';
import { DepartmentService } from '../../../../core/services/department.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-classe',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './edit-classe.component.html',
  styleUrls: ['./edit-classe.component.css']
})
export class EditClasseComponent implements OnInit {
  classeForm: FormGroup;
  classeId: string = '';
  departments: any[] = [];

  constructor(
    private fb: FormBuilder,
    private classeService: ClasseService,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.classeForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      idDepartment: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.classeId = this.route.snapshot.params['id'];
    this.loadDepartments();
    this.loadClasse();
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

  loadClasse(): void {
    this.classeService.byId(this.classeId).subscribe({
      next: (classe: any) => {
        this.classeForm.patchValue({
          nom: classe.nom,
          idDepartment: classe.idDepartment._id
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger la classe'
        });
        this.router.navigate(['/dashboard/classes']);
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

    this.classeService.update(this.classeId, this.classeForm.value).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Classe mise à jour avec succès'
        });
        this.router.navigate(['/dashboard/classes']);
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