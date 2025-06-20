import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ActualiteService } from '../../../../core/services/actualite.service';
import { UserService } from '../../../../core/services/user.service';
import { AuthenticationService } from '../../../../core/auth/authentication.service';

@Component({
  selector: 'app-create-actualite',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './create-actualite.component.html',
  styleUrls: ['./create-actualite.component.css']
})
export class CreateActualiteComponent {
  actualiteForm: FormGroup;
  selectedImage: File | null = null;
  selectedAttachment: File | null = null;
  categories = ['actualite', 'formation', 'manifestation', 'emploi du temps'];

  user: any;
  constructor(
    private fb: FormBuilder,
    private actualiteService: ActualiteService,
    private router: Router,
    private _user: AuthenticationService
  ) {
    this.actualiteForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      categorie: ['actualite', [Validators.required]],
      tags: [''],
      author: [''] // This should be populated with current user ID
    });
  }

  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  onAttachmentSelected(event: any) {
    this.selectedAttachment = event.target.files[0];
  }

  onSubmit() {
    if (this.actualiteForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs obligatoires correctement'
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', this.actualiteForm.value.title);
    formData.append('content', this.actualiteForm.value.content);
    formData.append('categorie', this.actualiteForm.value.categorie);
    formData.append('author', this._user.getDataFromToken()._id ); // Replace with actual user ID
    
    if (this.actualiteForm.value.tags) {
      formData.append('tags', this.actualiteForm.value.tags);
    }

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    if (this.selectedAttachment) {
      formData.append('attachement', this.selectedAttachment);
    }

    this.actualiteService.create(formData).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Actualité créée avec succès'
        });
        this.router.navigate(['/dashboard/actualite']);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la création'
        });
        console.error(err);
      }
    });
  }
}