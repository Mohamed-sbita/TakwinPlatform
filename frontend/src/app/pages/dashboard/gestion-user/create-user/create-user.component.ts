import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../../../core/services/user.service';
import { ClasseService } from '../../../../core/services/classe.service';
import { GroupeService } from '../../../../core/services/groupe.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  userForm: FormGroup;
  bulkForm: FormGroup;
  roles = ['admin', 'formateur', 'stagiaire'];
  classes: any[] = [];
  groupes: any[] = [];
  selectedFile: File | null = null;
  activeTab: 'single' | 'bulk' = 'single';
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private classeService: ClasseService,
    private groupeService: GroupeService,
    private router: Router
  ) {
    // Initialize single user form
    this.userForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      tel: ['', [Validators.pattern(/^[0-9]{8,15}$/)]],
      role: ['stagiaire', Validators.required],
      dateNaissance: [''],
      adresse: [''],
      nomParent: [''],
      telParent: ['']
    });

    // Initialize bulk upload form
    this.bulkForm = this.fb.group({
      idClasse: ['', Validators.required],
      idGroupe: ['', Validators.required],
      file: [null, Validators.required]
    });

    this.loadClasses();
  }

  loadClasses() {
    this.classeService.list().subscribe({
      next: (classes: any) => {
        this.classes = classes;
        if (classes.length > 0) {
          this.loadGroupes(classes[0]._id);
          this.bulkForm.patchValue({ idClasse: classes[0]._id });
        }
      },
      error: (error) => console.error('Error loading classes:', error)
    });
  }

  loadGroupes(classeId: string) {
    this.groupeService.getByClasse(classeId).subscribe({
      next: (groupes: any) => {
        this.groupes = groupes;
        if (groupes.length > 0) {
          this.bulkForm.patchValue({ idGroupe: groupes[0]._id });
        }
      },
      error: (error) => console.error('Error loading groupes:', error)
    });
  }

  onClasseChange(classeId: string) {
    this.loadGroupes(classeId);
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.bulkForm.patchValue({ file: this.selectedFile });
    }
  }

  createSingleUser() {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      return;
    }

    this.isLoading = true;
    const formData = this.userForm.value;

    // Set default values for stagiaire
    if (formData.role === 'stagiaire') {
      formData.codeInscription = this.generateRandomCode();
      formData.dateNaissance = formData.dateNaissance || new Date();
    }

    this.userService.create(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Success!',
          text: 'utilisateur crée avec succès',
          icon: 'success',
          confirmButtonColor: '#4CAF50',
          timer: 2000
        }).then(() => {
          this.router.navigate(['/dashboard/utilisateur']);
        });
      },
      error: (error) => {
        this.isLoading = false;
        let errorMessage = 'An error occurred while creating the user';
        
        if (error.error && error.error.includes('E11000')) {
          errorMessage = 'ce email dejà existe. Veuillez utiliser un autre email.';
        }

        Swal.fire({
          title: 'Error!',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#F44336'
        });
      }
    });
  }

  createBulkUsers() {
    if (this.bulkForm.invalid || !this.selectedFile) {
      this.markFormGroupTouched(this.bulkForm);
      return;
    }

    this.isLoading = true;
    const { idClasse, idGroupe } = this.bulkForm.value;
    const formData = this.userService.prepareBulkUploadData(this.selectedFile, idClasse, idGroupe);

    this.userService.bulkCreateStagiaires(formData).subscribe({
      next: (response) => {
        this.isLoading = false;

          

// Affichage des erreurs s’il y en a
if (response.errors && response.errors.length > 0) {
  const errorHtml = response.errors
    .map((err: any) => `🟠 <b>Ligne ${err.row}</b> : ${err.message}`)
    .join('<br><br>');

  Swal.fire({
    title: `Création partielle : ${response.createdCount} stagiaire(s)`,
    html: `
      <p>Des erreurs ont été rencontrées :</p>
      ${errorHtml}
    `,
    icon: 'warning',
    confirmButtonText: 'OK'
  });
} else {
  // Tous les utilisateurs ont été créés sans erreur
  Swal.fire({
    title: 'Création réussie',
    html: `<p>${response.createdCount} stagiaire(s) ajoutés avec succès.</p>`,
    icon: 'success',
    confirmButtonText: 'OK'
  });
}
        this.router.navigate(['/dashboard/utilisateur'])
        console.log('Created users:', response.createdUsers);
        console.log('Errors:', response.errors);
      },
      error: (error) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Error!',
          text: 'Failed to process bulk upload',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        console.error('Bulk upload error:', error);
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  switchTab(tab: 'single' | 'bulk') {
    this.activeTab = tab;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private generateRandomCode(): string {
    return 'USR' + Math.floor(100000 + Math.random() * 900000);
  }
}