import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { UserService } from '../../../../core/services/user.service';
import { ClasseService } from '../../../../core/services/classe.service';
import { GroupeService } from '../../../../core/services/groupe.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  userForm: FormGroup;
  userId: string = '';
  isLoading = false;
  showPassword = false;
  classes: any[] = [];
  groupes: any[] = [];
  userImage: string = 'admin.png';
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private classeService: ClasseService,
    private groupeService: GroupeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      tel: ['', [Validators.pattern(/^[0-9]{8,15}$/)]],
      role: ['stagiaire', Validators.required],
      dateNaissance: [''],
      adresse: [''],
      nomParent: [''],
      telParent: [''],
      codeInscription: [''],
      idClasse: [''],
      idGroupe: ['']
    });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.params['id'];
    this.loadUserData();
    this.loadClasses();
  }

  loadUserData() {
    this.isLoading = true;
    this.userService.byid(this.userId).subscribe({
      next: (user: any) => {
        this.userImage = user.image || 'admin.png';
        this.userForm.patchValue({
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          tel: user.tel,
          role: user.role,
          dateNaissance: this.formatDateForInput(user.dateNaissance),
          adresse: user.adresse,
          nomParent: user.nomParent,
          telParent: user.telParent,
          codeInscription: user.codeInscription,
          idClasse: user.idClasse?._id || '',
          idGroupe: user.idGroupe?._id || ''
        });

        if (user.idClasse) {
          this.loadGroupes(user.idClasse._id);
        }

        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading user data:', error);
        this.isLoading = false;
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load user data',
          icon: 'error',
          confirmButtonColor: '#F44336'
        }).then(() => {
          this.router.navigate(['/dashboard/utilisateur']);
        });
      }
    });
  }

  loadClasses() {
    this.classeService.list().subscribe({
      next: (classes: any) => {
        this.classes = classes;
      },
      error: (error) => console.error('Error loading classes:', error)
    });
  }

  loadGroupes(classeId: string) {
    this.groupeService.getByClasse(classeId).subscribe({
      next: (groupes: any) => {
        this.groupes = groupes;
      },
      error: (error) => console.error('Error loading groupes:', error)
    });
  }

  onClasseChange(classeId: string) {
    this.userForm.patchValue({ idGroupe: '' });
    this.loadGroupes(classeId);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    const formValues = this.userForm.value;

    // Append all form values
    Object.keys(formValues).forEach(key => {
      if (formValues[key] !== null && formValues[key] !== undefined && formValues[key] !== '') {
        formData.append(key, formValues[key]);
      }
    });

    // Append image file if selected
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      formData.append('image', fileInput.files[0]);
    }

    this.userService.update(this.userId, formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Success!',
          text: 'utilisateur mis à jour avec succès',
          icon: 'success',
          confirmButtonColor: '#4CAF50',
          timer: 2000
        }).then(() => {
          this.router.navigate(['/dashboard/utilisateur']);
        });
      },
      error: (error) => {
        this.isLoading = false;
        let errorMessage = 'An error occurred while updating the user';
        
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private formatDateForInput(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
}