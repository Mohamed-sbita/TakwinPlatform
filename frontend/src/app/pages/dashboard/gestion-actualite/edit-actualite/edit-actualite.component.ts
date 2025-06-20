import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ActualiteService } from '../../../../core/services/actualite.service';
import { AuthenticationService } from '../../../../core/auth/authentication.service';

@Component({
  selector: 'app-edit-actualite',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
  templateUrl: './edit-actualite.component.html',
  styleUrls: ['./edit-actualite.component.css']
})
export class EditActualiteComponent implements OnInit {
  actualiteForm: FormGroup;
  selectedImage: File | null = null;
  selectedAttachment: File | null = null;
  categories = ['actualite', 'formation', 'manifestation', 'emploi du temps'];
  actualiteId: string = '';
  currentImageUrl: string | null = null;
  currentAttachmentUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private actualiteService: ActualiteService,
    private router: Router,
    private route: ActivatedRoute,
    private _user: AuthenticationService
  ) {
    this.actualiteForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      categorie: ['actualite', [Validators.required]],
      tags: [''],
      author: ['']
    });
  }

  ngOnInit(): void {
    this.actualiteId = this.route.snapshot.params['id'];
    this.loadActualite();
  }

  loadActualite(): void {
    this.actualiteService.byid(this.actualiteId).subscribe({
      next: (actualite: any) => {
        this.actualiteForm.patchValue({
          title: actualite.title,
          content: actualite.content,
          categorie: actualite.categorie,
          tags: actualite.tags?.join(','),
          author: actualite.author
        });

        if (actualite.image) {
          this.currentImageUrl =  'http://127.0.0.1:3000/files/' + actualite.image ;
        }
        if (actualite.attachement) {
          this.currentAttachmentUrl = 'http://127.0.0.1:3000/files/' + actualite.attachement ;
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger l\'actualité'
        });
        this.router.navigate(['/dashboard/actualite']);
      }
    });
  }

  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
    // Clear current image preview if new image is selected
    if (this.selectedImage) {
      this.currentImageUrl = null;
    }
  }

  onAttachmentSelected(event: any) {
    this.selectedAttachment = event.target.files[0];
    // Clear current attachment preview if new attachment is selected
    if (this.selectedAttachment) {
      this.currentAttachmentUrl = null;
    }
  }

  removeImage() {
    this.selectedImage = null;
    this.currentImageUrl = null;
    // You might want to add logic to delete the existing image from server
  }

  removeAttachment() {
    this.selectedAttachment = null;
    this.currentAttachmentUrl = null;
    // You might want to add logic to delete the existing attachment from server
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
    
    if (this.actualiteForm.value.tags) {
      formData.append('tags', this.actualiteForm.value.tags);
    }

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    } else if (this.currentImageUrl === null) {
      // If image is removed
      formData.append('removeImage', 'true');
    }

    if (this.selectedAttachment) {
      formData.append('attachement', this.selectedAttachment);
    } else if (this.currentAttachmentUrl === null) {
      // If attachment is removed
      formData.append('removeAttachment', 'true');
    }

    this.actualiteService.update(this.actualiteId, formData).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Actualité mise à jour avec succès'
        });
        this.router.navigate(['/dashboard/actualite']);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la mise à jour'
        });
        console.error(err);
      }
    });
  }
}