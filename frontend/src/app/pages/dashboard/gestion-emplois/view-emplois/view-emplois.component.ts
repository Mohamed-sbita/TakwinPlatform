import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EmploiDuTempsService } from '../../../../core/services/emploi-du-temps.service';
import { ClasseService } from '../../../../core/services/classe.service';

@Component({
  selector: 'app-view-emplois',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-emplois.component.html',
  styleUrls: ['./view-emplois.component.css']
})
export class ViewEmploisComponent implements OnInit {
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

  constructor(
    private route: ActivatedRoute,
    private emploiService: EmploiDuTempsService,
    private classeService: ClasseService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadEmploi(id);
  }

  loadEmploi(id: string): void {
    this.isLoading = true;
    this.emploiService.byId(id).subscribe({
      next: (emploi: any) => {
        this.emploi = emploi;
        // Sort days according to daysOrder
        this.emploi.jours.sort((a: any, b: any) => {
          return this.daysOrder.indexOf(a.nomJour) - this.daysOrder.indexOf(b.nomJour);
        });
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement de l\'emploi du temps';
        console.error(err);
      }
    });
  }

  getCreneauxForDay(dayName: string): any[] | undefined {
    const day = this.emploi?.jours.find((j: any) => j.nomJour === dayName);
    return day?.creneaux;
  }

  getCreneauxForTimeSlot(dayName: string, timeSlot: any): any[] {
    const creneaux = this.getCreneauxForDay(dayName);
    if (!creneaux) return [];

    return creneaux.filter((c: any) => 
      c.heureDebut === timeSlot.start && c.heureFin === timeSlot.end
    );
  }

  formatFormateurName(formateurId: string): string {
    if (!this.emploi?.formateurs) return 'Inconnu';
    const formateur = this.emploi.formateurs.find((f: any) => f._id === formateurId);
    return formateur ? `${formateur.nom} ${formateur.prenom}` : 'Inconnu';
  }
}