import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmploiDuTempsService } from '../../../../core/services/emploi-du-temps.service';
import { AuthenticationService } from '../../../../core/auth/authentication.service';

@Component({
  selector: 'app-user-emplois',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-emplois.component.html',
  styleUrls: ['./user-emplois.component.css']
})
export class UserEmploisComponent implements OnInit {
  emploi: any = null;
  isLoading = true;
  errorMessage = '';
  timeSlots = [
    { start: '08:30', end: '10:00' },
    { start: '10:15', end: '11:45' },
    { start: '12:00', end: '13:30' },
    { start: '14:30', end: '16:00' },
    { start: '16:15', end: '17:45' }
  ];
  daysOrder = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  user: any;

  constructor(
    private emploiService: EmploiDuTempsService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getDataFromToken();
    this.loadUserEmploi();
  }

  loadUserEmploi(): void {
    this.isLoading = true;
    console.log(this.user);
    
    if (!this.user?.idClasse) {
      this.isLoading = false;
      this.errorMessage = "Vous n'avez pas de classe assignée";
      return;
    }

    this.emploiService.getByUser(this.user._id).subscribe({
      next: (emploi: any) => {
        this.emploi = emploi;
        // Sort days according to daysOrder
        if (this.emploi?.jours) {
          this.emploi.jours.sort((a: any, b: any) => {
            return this.daysOrder.indexOf(a.nomJour) - this.daysOrder.indexOf(b.nomJour);
          });
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement de votre emploi du temps';
        console.error(err);
      }
    });
  }

  getCreneauxForDay(dayName: string): any[] | undefined {
    const day = this.emploi?.jours?.find((j: any) => j.nomJour === dayName);
    return day?.creneaux;
  }

  getCreneauxForTimeSlot(dayName: string, timeSlot: any): any[] {
    const creneaux = this.getCreneauxForDay(dayName);
    if (!creneaux) return [];

    return creneaux.filter((c: any) => 
      c.heureDebut === timeSlot.start && c.heureFin === timeSlot.end
    );
  }
}