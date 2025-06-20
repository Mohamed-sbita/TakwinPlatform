import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmploiDuTempsService } from '../../../../core/services/emploi-du-temps.service';
import { ClasseService } from '../../../../core/services/classe.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-emplois',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-emplois.component.html',
  styleUrls: ['./list-emplois.component.css']
})
export class ListEmploisComponent implements OnInit {
  emplois: any[] = [];
  filteredEmplois: any[] = [];
  classes: any[] = [];
  isLoading = true;
  errorMessage = '';
  searchTerm = '';
  selectedClasse = '';

  constructor(
    private emploiService: EmploiDuTempsService,
    private classeService: ClasseService
  ) {}

  ngOnInit(): void {
    this.loadEmplois();
    this.loadClasses();
  }

  loadEmplois(): void {
    this.isLoading = true;
    this.emploiService.list().subscribe({
      next: (emplois: any) => {
        this.emplois = emplois;
        this.filteredEmplois = [...emplois];
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement des emplois du temps';
        console.error(err);
      }
    });
  }

  loadClasses(): void {
    this.classeService.list().subscribe({
      next: (classes: any) => {
        this.classes = classes;
      },
      error: (err: any) => {
        console.error('Error loading classes', err);
      }
    });
  }

  filterEmplois(): void {
    this.filteredEmplois = this.emplois.filter(emploi => {
      const matchesSearch = emploi.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           emploi.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesClasse = !this.selectedClasse || emploi.classe._id === this.selectedClasse;
      return matchesSearch && matchesClasse;
    });
  }

  confirmDelete(id: string): void {
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
        this.deleteEmploi(id);
      }
    });
  }

  deleteEmploi(id: string): void {
    this.emploiService.delete(id).subscribe({
      next: () => {
        this.emplois = this.emplois.filter(e => e._id !== id);
        this.filteredEmplois = this.filteredEmplois.filter(e => e._id !== id);
        Swal.fire(
          'Supprimé!',
          "L'emploi du temps a été supprimé.",
          'success'
        );
      },
      error: (err: any) => {
        Swal.fire(
          'Erreur!',
          "Une erreur est survenue lors de la suppression.",
          'error'
        );
        console.error(err);
      }
    });
  }

  getClasseName(classeId: string): string {
    const classe = this.classes.find(c => c._id === classeId);
    return classe ? classe.nom : 'Inconnue';
  }
}