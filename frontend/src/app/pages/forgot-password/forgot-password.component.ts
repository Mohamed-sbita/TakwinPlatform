import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css' // Reusing the same CSS
})
export class ForgotPasswordComponent {

  forgotForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private _user: UserService, 
    private _router: Router
  ) {
    let controls = {
      email: new FormControl('', [Validators.required, Validators.email])
    }
    this.forgotForm = fb.group(controls);
  }

  sendResetLink() {
    this._user.forgotPassword(this.forgotForm.value.email).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: "success",
          title: "Email Sent",
          text: "une demande de réinitialisation de mot de passe a été envoyée à votre adresse e-mail.",
        });
        
      },
      error: (err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Une erreur s'est produite lors de l'envoi de l'e-mail de réinitialisation",
        });
      }
    });
  }
}