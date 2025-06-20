import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActualiteService } from '../../../../core/services/actualite.service';

@Component({
  selector: 'app-public-actualite',
  standalone: true,
  imports: [ CommonModule, RouterModule, FormsModule, NgxPaginationModule ],
  templateUrl: './public-actualite.component.html',
  styleUrl: './public-actualite.component.css'
})
export class PublicActualiteComponent {
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


}
