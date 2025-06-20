import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AttestationService } from '../../../core/services/attestation.service';
import { AuthenticationService } from '../../../core/auth/authentication.service';

@Component({
  selector: 'app-request-attestation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './resquest-attestation.component.html',
  styleUrls: ['./resquest-attestation.component.css']
})
export class RequestAttestationComponent implements OnInit {
  attestationForm: FormGroup;
  isLoading = false;
  isFetchingRequests = false;
  message = '';
  error = '';
  showSuccess = false;
  userRequests: any[] = [];
  activeTab: 'request' | 'history' = 'request';

  constructor(
    private fb: FormBuilder,
    private attestationService: AttestationService,
    private authService: AuthenticationService
  ) {
    this.attestationForm = this.fb.group({
      agreeTerms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    this.loadUserRequests();
  }

  onSubmit() {
    if (this.attestationForm.invalid) {
      this.attestationForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const user = this.authService.getDataFromToken();

    this.attestationService.createRequest(user._id).subscribe({
      next: () => {
        this.isLoading = false;
        this.showSuccess = true;
        this.message = 'Votre demande a été envoyée avec succès!';
        this.attestationForm.reset();
        this.loadUserRequests();
        setTimeout(() => this.showSuccess = false, 5000);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Une erreur est survenue lors de la soumission';
        setTimeout(() => this.error = '', 5000);
      }
    });
  }

  loadUserRequests() {
    this.isFetchingRequests = true;
    const user = this.authService.getDataFromToken();
    
    this.attestationService.getUserRequests(user._id).subscribe({
      next: (requests) => {
        this.userRequests = requests;
        this.isFetchingRequests = false;
      },
      error: (err) => {
        this.isFetchingRequests = false;
        console.error('Failed to load requests', err);
      }
    });
  }

  switchTab(tab: 'request' | 'history') {
    this.activeTab = tab;
    if (tab === 'history') {
      this.loadUserRequests();
    }
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'En attente',
      'approved': 'Approuvée',
      'rejected': 'Rejetée'
    };
    return statusMap[status] || status;
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'pending': 'warning',
      'approved': 'success',
      'rejected': 'danger'
    };
    return colorMap[status] || 'secondary';
  }
}