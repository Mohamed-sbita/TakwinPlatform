import { Component } from '@angular/core';
import { ActualiteService } from '../../../../core/services/actualite.service';
import Swal from 'sweetalert2';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../../core/auth/authentication.service';

@Component({
  selector: 'app-list-cours',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './list-cours.component.html',
  styleUrl: './list-cours.component.css'
})
export class ListCoursComponent {

user :any ;
  coursList: any[] = [];
    p: number = 1;
    itemsPerPage: number = 10;
  
    constructor(private actualite : ActualiteService,private auth : AuthenticationService) {}
  
    ngOnInit(): void {
      this.loadcours();
      console.log(this.coursList);
      this.user = this.auth.getDataFromToken();
      console.log(this.user);


      
    }
  
    loadcours(): void {
      this.actualite.listcours().subscribe({
        next: (res: any) => {
          this.coursList = res;
          console.log('Liste des cours chargée:', this.coursList);
          
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible de charger la liste des classes'
          });
        }
      });
    }
  
    deleteCours(id: string): void {
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
          this.actualite.deletecours(id).subscribe({
            next: () => {
              Swal.fire(
                'Supprimé!',
                'La classe a été supprimée.',
                'success'
              );
              this.loadcours();
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

