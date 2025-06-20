import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatiereService } from '../../../../core/services/matiere.service';
import { FormsModule } from '@angular/forms'; // Add this import
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-matiere',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // Add FormsModule here
  templateUrl: './list-matiere.component.html',
  styleUrls: ['./list-matiere.component.css']
})
export class ListMatiereComponent implements OnInit {
  matieres: any[] = [];
  filteredMatieres: any[] = []; // Add this for filtered results
  isLoading = true;
  errorMessage = '';
  searchTerm = ''; // Add this for search input

  constructor(private matiereService: MatiereService) {}

  ngOnInit(): void {
    this.loadMatieres();
  }

  loadMatieres(): void {
    this.isLoading = true;
    this.matiereService.list().subscribe({
      next: (matieres: any) => {
        this.matieres = matieres;
        this.filteredMatieres = [...matieres]; // Initialize filtered array
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement des matières';
        console.error(err);
      }
    });
  }

  // Add this method to filter matieres
  filterMatieres(): void {
    if (!this.searchTerm) {
      this.filteredMatieres = [...this.matieres];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredMatieres = this.matieres.filter(matiere => 
      matiere.nom.toLowerCase().includes(term) || 
      (matiere.description && matiere.description.toLowerCase().includes(term)) ||
      (matiere.formateur && (
        matiere.formateur.nom.toLowerCase().includes(term) || 
        matiere.formateur.prenom.toLowerCase().includes(term)
      )) ||
      (matiere.classes && matiere.classes.some((classe: any) => 
        classe.nom.toLowerCase().includes(term)
      ))
    );
  }

  confirmDelete(matiereId: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas annuler cette action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteMatiere(matiereId);
      }
    });
  }

  deleteMatiere(matiereId: string): void {
    this.matiereService.delete(matiereId).subscribe({
      next: () => {
        this.matieres = this.matieres.filter(m => m._id !== matiereId);
        this.filterMatieres(); // Update filtered list after deletion
        Swal.fire(
          'Supprimé!',
          'La matière a été supprimée.',
          'success'
        );
      },
      error: (err: any) => {
        Swal.fire(
          'Erreur!',
          'Une erreur est survenue lors de la suppression.',
          'error'
        );
        console.error(err);
      }
    });
  }
}