import { Component } from '@angular/core';
import { ActualiteService } from '../../../../core/services/actualite.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../../core/auth/authentication.service';
import { UserService } from '../../../../core/services/user.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-cours',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './public-cours.component.html',
  styleUrl: './public-cours.component.css'
})
export class PublicCoursComponent {


user : any ;
  coursList: any[] = [];
    p: number = 1;
    itemsPerPage: number = 10;
  
    constructor(private actualite : ActualiteService , private _user : AuthenticationService,private formateur : UserService) {}
  
    ngOnInit(): void {
      console.log(this.coursList);
       this.user = this._user.getDataFromToken();
      console.log(this.user.idClasse);
      this.loadcours();

      


      

      
      
    }
  
    loadcours(): void {
      this.actualite.listcoursbyidClass(this.user.idClasse).subscribe({
        next: (res: any) => {
         console.log(res);
          this.coursList = res;
          // get pour chaque cours l'auteur
          this.coursList.forEach((cours: any) => {  
            this.formateur.byid(cours.author._id).subscribe((user: any) => {
              cours.author.fullname = user.nom+ ' ' + user.prenom;
              console.log(cours.author);
              
            });
          });
          console.log(this.coursList);
         
          
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'No courses found for this class'
          });
        }
      });
    }
  
    
  }

