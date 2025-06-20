import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatiereService } from '../../../../core/services/matiere.service';
import { UserService } from '../../../../core/services/user.service';
import { ClasseService } from '../../../../core/services/classe.service';

@Component({
  selector: 'app-create-matiere',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
  templateUrl: './create-matiere.component.html',
  styleUrls: ['./create-matiere.component.css']
})
export class CreateMatiereComponent implements OnInit {
  matiereForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  formateurs: any[] = [];
  classes: any[] = [];
  selectedClasses: string[] = [];

  constructor(
    private fb: FormBuilder,
    private matiereService: MatiereService,
    private userService: UserService,
    private classeService: ClasseService,
    private router: Router
  ) {
    this.matiereForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      formateur: [''],
      classes: [[]]
    });
  }

  ngOnInit(): void {
    this.loadFormateurs();
    this.loadClasses();
  }

  loadFormateurs(): void {
    this.userService.list().subscribe({
      next: (users: any) => {
        this.formateurs = users.filter((user: any) => user.role === 'formateur');
      },
      error: (err: any) => {
        console.error('Error loading formateurs', err);
      }
    });
  }

  loadClasses(): void {
    this.classeService.list().subscribe({
      next: (classes: any) => {
        this.classes = classes;
      },
      error: (err: any) => {
        console.error('Error loading classes', err);
      }
    });
  }

  toggleClassSelection(classeId: string): void {
    if (this.selectedClasses.includes(classeId)) {
      this.selectedClasses = this.selectedClasses.filter(id => id !== classeId);
    } else {
      this.selectedClasses.push(classeId);
    }
    this.matiereForm.patchValue({ classes: this.selectedClasses });
  }

  onSubmit(): void {
    if (this.matiereForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const newMatiere: any = {
      nom: this.matiereForm.value.nom,
      description: this.matiereForm.value.description,
      classes: this.selectedClasses
    };

    this.matiereService.create(newMatiere).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard/matieres']);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la création de la matière';
        console.error(err);
      }
    });
  }

  get nom() {
    return this.matiereForm.get('nom');
  }
}