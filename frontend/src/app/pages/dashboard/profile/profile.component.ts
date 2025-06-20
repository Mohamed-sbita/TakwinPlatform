import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { HttpClient, HttpEventType, HttpClientModule } from '@angular/common/http';
import { UserService } from '../../../core/services/user.service';
import { AuthenticationService } from '../../../core/auth/authentication.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: any;
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  isUploading: boolean = false;
  apiUrl = 'http://127.0.0.1:3000';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthenticationService,
    private http: HttpClient
  ) {
    this.profileForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tel: [''],
      password: [''],
      confirmPassword: ['']
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  loadUserProfile(): void {
    this.currentUser = this.authService.getDataFromToken();
    if (this.currentUser) {
      console.log('Current User:', this.currentUser);
      
      this.profileForm.patchValue({
        fullname: this.currentUser.nom + ' ' + this.currentUser.prenom,
        email: this.currentUser.email,
        tel: this.currentUser.tel
      });
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.uploadImage();
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.uploadProgress = 0;
    
    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.put(`${this.apiUrl}/user/update/${this.currentUser._id}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.isUploading = false;
          console.log(event);
          
          localStorage.setItem('token',event.body.token);
          
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          this.currentUser = this.authService.getDataFromToken();
        }
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.isUploading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    const formData = this.profileForm.value;
    // Remove confirmPassword and empty password
    if (!formData.password) {
      delete formData.password;
    }
    delete formData.confirmPassword;

    this.userService.update(this.currentUser._id, formData).subscribe({
      next: (updatedUser: any) => {
        console.log(updatedUser);
        
        localStorage.setItem('token',updatedUser.token);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
     
      },
      error: (err: any) => {
        console.error('Update error:', err);
        alert('Error updating profile');
      }
    });
  }

  getProfileImage(): string {
    if (this.currentUser?.image) {
      return `${this.apiUrl}/files/${this.currentUser.image}`;
    }
    return 'assets/default-profile.png';
  }
}