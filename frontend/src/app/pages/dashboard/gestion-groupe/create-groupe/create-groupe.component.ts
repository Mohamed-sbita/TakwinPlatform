import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GroupeService } from '../../../../core/services/groupe.service';
import { ClasseService } from '../../../../core/services/classe.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-groupe',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
  templateUrl: './create-groupe.component.html',
  styleUrls: ['./create-groupe.component.css']
})
export class CreateGroupeComponent {
  groupeForm: FormGroup;
  classes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private groupeService: GroupeService,
    private classeService: ClasseService,
    private router: Router
  ) {
    this.groupeForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      idClasse: ['', Validators.required]
    });
    this.loadClasses();
  }

  loadClasses(): void {
    this.classeService.list().subscribe({
      next: (classes: any) => {
        this.classes = classes;
      },
      error: (err) => {
        console.error('Failed to load classes', err);
      }
    });
  }

  onSubmit(): void {
    if (this.groupeForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs obligatoires correctement'
      });
      return;
    }

    this.groupeService.create(this.groupeForm.value).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Groupe créé avec succès'
        });
        this.router.navigate(['/dashboard/groupes']);
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