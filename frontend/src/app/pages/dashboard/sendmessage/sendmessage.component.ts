import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../core/services/contact.service';

@Component({
  selector: 'app-sendmessage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sendmessage.component.html',
  styleUrls: ['./sendmessage.component.css']
})
export class SendmessageComponent {
  messageForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {
    this.messageForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.messageForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.errorMessage = '';

    this.contactService.sendMessage(this.messageForm.value).subscribe({
      next: () => {
        this.submitSuccess = true;
        this.messageForm.reset();
        this.isSubmitting = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to send message. Please try again later.';
        this.isSubmitting = false;
        console.error('Error sending message:', err);
      }
    });
  }

  get name() { return this.messageForm.get('name'); }
  get email() { return this.messageForm.get('email'); }
  get subject() { return this.messageForm.get('subject'); }
  get message() { return this.messageForm.get('message'); }
}