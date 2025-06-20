import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GroupeService } from '../../../../core/services/groupe.service';
import { ClasseService } from '../../../../core/services/classe.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-groupe',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './edit-groupe.component.html',
  styleUrls: ['./edit-groupe.component.css']
})
export class EditGroupeComponent implements OnInit {
  groupeForm: FormGroup;
  groupeId: string = '';
  classes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private groupeService: GroupeService,
    private classeService: ClasseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.groupeForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      idClasse: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.groupeId = this.route.snapshot.params['id'];
    this.loadClasses();
    this.loadGroupe();
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

  loadGroupe(): void {
    this.groupeService.byId(this.groupeId).subscribe({
      next: (groupe: any) => {
        this.groupeForm.patchValue({
          nom: groupe.nom,
          idClasse: groupe.idClasse._id
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger le groupe'
        });
        this.router.navigate(['/dashboard/groupes']);
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

    this.groupeService.update(this.groupeId, this.groupeForm.value).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Groupe mis à jour avec succès'
        });
        this.router.navigate(['/dashboard/groupes']);
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