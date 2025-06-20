import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActualiteService } from '../../../../core/services/actualite.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-actualite',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxPaginationModule],
  templateUrl: './list-actualite.component.html',
  styleUrls: ['./list-actualite.component.css'],
})
export class ListActualiteComponent implements OnInit {
  actualites: any[] = [];
  filteredActualites: any[] = [];
  categories = [
    'Toutes',
    'actualite',
    'formation',
    'manifestation',
    'emploi du temps',
  ];
  selectedCategory = 'Toutes';
  searchTerm = '';
  p: number = 1;
  itemsPerPage: number = 6;

  constructor(private actualiteService: ActualiteService) {}

  ngOnInit(): void {
    this.loadActualites();
  }

  loadActualites(): void {
    this.actualiteService.list().subscribe({
      next: (data: any) => {
        this.actualites = data;
        this.filteredActualites = [...this.actualites];
      },
      error: (error) => {
        console.error('Error loading actualites:', error);
      },
    });
  }

  filterByCategory(): void {
    if (this.selectedCategory === 'Toutes') {
      this.filteredActualites = [...this.actualites];
    } else {
      this.filteredActualites = this.actualites.filter(
        (actualite) => actualite.categorie === this.selectedCategory
      );
    }
    this.p = 1; // Reset to first page when filtering
  }

  searchActualites(): void {
    if (!this.searchTerm) {
      this.filterByCategory();
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredActualites = this.actualites.filter(
      (actualite) =>
        actualite.title.toLowerCase().includes(term) ||
        actualite.content.toLowerCase().includes(term) ||
        (actualite.tags &&
          actualite.tags.some((tag: string) =>
            tag.toLowerCase().includes(term)
          ))
    );
    this.p = 1; // Reset to first page when searching
  }

  deleteActualite(id: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actualiteService.delete(id).subscribe({
          next: () => {
            Swal.fire(
              'Supprimé !',
              'L\'actualité a été supprimée.',
              'success'
            );
            this.loadActualites();
          },
          error: (error) => {
            console.error('Error deleting actualite:', error);
            Swal.fire(
              'Erreur',
              'Une erreur est survenue lors de la suppression.',
              'error'
            );
          },
        });
      }
    });
  }
}
