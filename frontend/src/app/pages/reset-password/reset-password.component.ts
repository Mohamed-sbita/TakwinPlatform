import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css' // Reusing the same CSS
})
export class ResetPasswordComponent {

  resetForm: FormGroup;
  token: string = '';

  constructor(
    private fb: FormBuilder, 
    private _user: UserService, 
    private _router: Router,
    private route: ActivatedRoute
  ) {
    this.token = this.route.snapshot.params['token'];
    
    let controls = {
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    }
    this.resetForm = fb.group(controls);
  }

  resetPassword() {
    if (this.resetForm.value.password !== this.resetForm.value.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords don't match!",
      });
      return;
    }

    this._user.resetPassword(this.token, this.resetForm.value.password).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: "success",
          title: "Password Reset",
          text: "Your password has been reset successfully",
        });
        this._router.navigate(['/login']);
      },
      error: (err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid or expired token. Please try again.",
        });
      }
    });
  }
}