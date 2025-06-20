import { Component, OnInit } from '@angular/core';
import { GroupeService } from '../../../../core/services/groupe.service';
import { ClasseService } from '../../../../core/services/classe.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-groupe',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxPaginationModule, FormsModule],
  templateUrl: './list-groupe.component.html',
  styleUrls: ['./list-groupe.component.css']
})
export class ListGroupeComponent implements OnInit {
  groupes: any[] = [];
  filteredGroupes: any[] = [];
  classes: any[] = [];
  selectedClass: string = '';
  p: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private groupeService: GroupeService,
    private classeService: ClasseService
  ) {}

  ngOnInit(): void {
    this.loadClasses();
    this.loadGroupes();
  }

  loadClasses(): void {
    this.classeService.list().subscribe({
      next: (classes: any) => {
        this.classes = classes;
      },
      error: (err) => {
        console.error('Failed to load classes', err);
      }
    });
  }

  loadGroupes(): void {
    this.groupeService.list().subscribe({
      next: (res: any) => {
        this.groupes = res;
        this.filteredGroupes = [...this.groupes];
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger la liste des groupes'
        });
      }
    });
  }

  filterByClass(): void {
    if (!this.selectedClass) {
      this.filteredGroupes = [...this.groupes];
    } else {
      this.filteredGroupes = this.groupes.filter(
        groupe => groupe.idClasse?._id === this.selectedClass
      );
    }
    this.p = 1; // Reset to first page when filtering
  }

  resetFilter(): void {
    this.selectedClass = '';
    this.filteredGroupes = [...this.groupes];
    this.p = 1;
  }

  deleteGroupe(id: string): void {
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
        this.groupeService.delete(id).subscribe({
          next: () => {
            Swal.fire(
              'Supprimé!',
              'Le groupe a été supprimé.',
              'success'
            );
            this.loadGroupes();
          },
          error: (err) => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur est survenue lors de la suppression'
            });
          }
        });
      }
    });
  }
}