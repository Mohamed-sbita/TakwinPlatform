import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmploiDuTempsService } from '../../../../core/services/emploi-du-temps.service';
import { AuthenticationService } from '../../../../core/auth/authentication.service';

@Component({
  selector: 'app-formateur-emplois',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formateur-emplois.component.html',
  styleUrls: ['./formateur-emplois.component.css']
})
export class FormateurEmploisComponent implements OnInit {
  creneaux: any[] = [];
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
    this.loadFormateurEmploi();
  }

  loadFormateurEmploi(): void {
    this.isLoading = true;
    
    if (!this.user?._id) {
      this.isLoading = false;
      this.errorMessage = "Utilisateur non identifié";
      return;
    }

    this.emploiService.getByFormateur(this.user._id).subscribe({
      next: (creneaux: any[]) => {
        this.creneaux = creneaux;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement de votre emploi du temps';
        console.error(err);
      }
    });
  }

  getCreneauxForDayAndSlot(dayName: string, timeSlot: any): any[] {
    return this.creneaux.filter(c => 
      c.jour === dayName && 
      c.heureDebut === timeSlot.start && 
      c.heureFin === timeSlot.end
    );
  }
}