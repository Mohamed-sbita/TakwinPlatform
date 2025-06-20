import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActualiteService } from '../../../../core/services/actualite.service';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../../core/auth/authentication.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ClasseService } from '../../../../core/services/classe.service';

@Component({
  selector: 'app-create-cours',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './create-cours.component.html',
  styleUrl: './create-cours.component.css'
})
export class CreateCoursComponent {

  coursForm: FormGroup;
  selectedAttachment: File | null = null;

  classes: any[] = [];     // À charger depuis un service
  // Facultatif, si besoin

  constructor(
    private fb: FormBuilder,
    private ActualiteService: ActualiteService,
    private router: Router,
    private _user: AuthenticationService,
    private ClasseService: ClasseService // Remplacer par le service approprié pour les classes
  ) {
    this.coursForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      class: ['', Validators.required],
      author: [''] // rempli automatiquement par le token
    });
  }

  ngOnInit(): void {
    this.loadClasses();
    // Remplir automatiquement le champ auteur
    const user = this._user.getDataFromToken();
    if (user && user._id) {
      this.coursForm.patchValue({ author: user._id });
    }
    console.log(this.classes);
    
    // Charger les classes si nécessaire
    // Exemple : this.classService.getAll().subscribe(res => this.classes = res);
  }

  onFileSelected(event: any) {
    this.selectedAttachment = event.target.files[0];
  }

  onSubmit() {
    if (this.coursForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs obligatoires correctement'
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', this.coursForm.value.title);
    formData.append('class', this.coursForm.value.class);
    formData.append('author', this.coursForm.value.author);

    if (this.selectedAttachment) {
      formData.append('attachement', this.selectedAttachment);
    }

    this.ActualiteService.createCours(formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Cours créé avec succès'
        });
        this.router.navigate(['/dashboard/cours']);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la création du cours'
        });
        console.error(err);
      }
    });
  }
loadClasses(): void {
    this.ClasseService.list().subscribe({
      next: (res: any) => {
        this.classes = res;
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger la liste des classes'
        });
      }
    });
  }

}