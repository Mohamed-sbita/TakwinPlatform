import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AttestationService } from '../../../core/services/attestation.service';
import { ClasseService } from '../../../core/services/classe.service';
import { id } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-list-attestation',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-attestation.component.html',
  styleUrls: ['./list-attestation.component.css']
})
export class ListAttestationComponent implements OnInit {
  attestations: any[] = [];
  filteredAttestations: any[] = [];
  isLoading = true;
  error = '';
  searchTerm = '';
  statusFilter = 'all';
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private attestationService: AttestationService,private cl : ClasseService) {}

  ngOnInit(): void {
    this.loadAttestations();
    
  }

  loadAttestations(): void {
    this.isLoading = true;
    this.attestationService.getAllRequests().subscribe({
      next: (data) => {
        this.attestations = data;
        this.filteredAttestations = [...data];
        this.isLoading = false;
        console.log('Attestations loaded:', this.attestations);
        
      },
      error: (err) => {
        this.error = 'Failed to load attestations';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  filterAttestations(): void {
    this.filteredAttestations = this.attestations.filter(att => {
      const matchesSearch = att.stagiaire.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           att.stagiaire.prenom.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.statusFilter === 'all' || att.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
    this.currentPage = 1;
  }

  updateStatus(id: string, status: string): void {
    this.attestationService.updateRequest(id, status).subscribe({
      next: () => {
        this.loadAttestations();
      },
      error: (err) => {
        this.error = 'Failed to update status';
        console.error(err);
      }
    });
  }

  get paginatedAttestations() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredAttestations.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredAttestations.length / this.itemsPerPage);
  }


  
  

  changePage(page: number) {
    this.currentPage = page;
  }
}