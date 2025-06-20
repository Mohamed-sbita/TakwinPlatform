import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmploiDuTempsService } from '../../../../core/services/emploi-du-temps.service';
import { ClasseService } from '../../../../core/services/classe.service';
import { MatiereService } from '../../../../core/services/matiere.service';
import { UserService } from '../../../../core/services/user.service';
import Swal from 'sweetalert2';

interface CreneauHoraire {
  heureDebut: string;
  heureFin: string;
}

@Component({
  selector: 'app-edit-emplois',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './edit-emplois.component.html',
  styleUrls: ['./edit-emplois.component.css']
})
export class EditEmploisComponent implements OnInit {
  emploiForm: FormGroup;
  emploiId: string = '';
  isLoading = false;
  errorMessage = '';
  joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  creneauxHoraires: CreneauHoraire[] = [
    { heureDebut: '08:30', heureFin: '10:00' },
    { heureDebut: '10:15', heureFin: '11:45' },
    { heureDebut: '12:00', heureFin: '13:30' },
    { heureDebut: '14:30', heureFin: '16:00' },
    { heureDebut: '16:15', heureFin: '17:45' }
  ];
  classes: any[] = [];
  matieres: any[] = [];
  formateurs: any[] = [];

  constructor(
    private fb: FormBuilder,
    private emploiService: EmploiDuTempsService,
    private classeService: ClasseService,
    private matiereService: MatiereService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.emploiForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      classe: ['', Validators.required],
      jours: this.fb.array([])
    });
  }

  get joursArray(): FormArray {
    return this.emploiForm.get('jours') as FormArray;
  }

  getCreneauxArray(jourIndex: number): FormArray {
    return (this.joursArray.at(jourIndex) as FormGroup).get('creneaux') as FormArray;
  }

  ngOnInit(): void {
    this.emploiId = this.route.snapshot.params['id'];
    this.loadClasses();
    this.loadMatieres();
    this.loadFormateurs();
    this.loadEmploi();
  }

  loadEmploi(): void {
    this.isLoading = true;
    this.emploiService.details(this.emploiId).subscribe({
      next: (emploi: any) => {
        this.emploiForm.patchValue({
          titre: emploi.titre,
          description: emploi.description,
          classe: emploi.classe._id
        });

        // Clear existing jours array
        while (this.joursArray.length) {
          this.joursArray.removeAt(0);
        }

        // Add jours and creneaux from the loaded emploi
        emploi.jours.forEach((jour: any) => {
          const jourGroup = this.fb.group({
            nomJour: [jour.nomJour, Validators.required],
            creneaux: this.fb.array([])
          });

          this.joursArray.push(jourGroup);

          const creneauxArray = this.getCreneauxArray(this.joursArray.length - 1);
          jour.creneaux.forEach((creneau: any) => {
            creneauxArray.push(this.fb.group({
              heureDebut: [creneau.heureDebut, Validators.required],
              heureFin: [creneau.heureFin, Validators.required],
              matiere: [creneau.matiere, Validators.required],
              formateur: [creneau.formateur, Validators.required],
              classe: [creneau.classe, Validators.required],
              salle: [creneau.salle,Validators.required]  // <-- ajout salle ici
            }));
          });
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

  loadMatieres(): void {
    this.matiereService.list().subscribe({
      next: (matieres: any) => {
        this.matieres = matieres;
      },
      error: (err: any) => {
        console.error('Error loading matieres', err);
      }
    });
  }

  loadFormateurs(): void {
    this.userService.list().subscribe({
      next: (users: any) => {
        this.formateurs = users.filter((user: any) => user.role === 'formateur');
      },
      error: (err: any) => {
        console.error('Error loading formateurs', err);
      }
    });
  }

  addCreneau(jourIndex: number): void {
    // Initialize all days up to the selected index
    for (let i = this.joursArray.length; i <= jourIndex; i++) {
      this.joursArray.push(this.fb.group({
        nomJour: [this.joursSemaine[i], Validators.required],
        creneaux: this.fb.array([])
      }));
    }

    const creneauGroup = this.fb.group({
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
      matiere: ['', Validators.required],
      formateur: ['', Validators.required],
      classe: [this.emploiForm.value.classe, Validators.required],
      salle: ['', Validators.required]  // <-- ajout salle ici
    });

    this.getCreneauxArray(jourIndex).push(creneauGroup);
  }

  onTimeRangeChange(jourIndex: number, creneauIndex: number): void {
    const creneauGroup = this.getCreneauxArray(jourIndex).at(creneauIndex) as FormGroup;
    const heureDebut = creneauGroup.get('heureDebut')?.value;
    const heureFin = creneauGroup.get('heureFin')?.value;

    if (!heureDebut || !heureFin) return;

    const startIndex = this.creneauxHoraires.findIndex(c => c.heureDebut === heureDebut);
    const endIndex = this.creneauxHoraires.findIndex(c => c.heureFin === heureFin);

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
      Swal.fire('Erreur', 'Sélection de créneau invalide', 'error');
      creneauGroup.get('heureFin')?.setValue('');
      return;
    }

    if (startIndex === endIndex) return;

    const matiere = creneauGroup.get('matiere')?.value;
    const formateur = creneauGroup.get('formateur')?.value;
    const classe = creneauGroup.get('classe')?.value;
    const salle = creneauGroup.get('salle')?.value; // <-- prendre aussi salle

    this.getCreneauxArray(jourIndex).removeAt(creneauIndex);

    for (let i = startIndex; i <= endIndex; i++) {
      const newCreneauGroup = this.fb.group({
        heureDebut: [this.creneauxHoraires[i].heureDebut, Validators.required],
        heureFin: [this.creneauxHoraires[i].heureFin, Validators.required],
        matiere: [matiere, Validators.required],
        formateur: [formateur, Validators.required],
        classe: [classe, Validators.required],
        salle: [salle, Validators.required]  // <-- propager salle aussi
      });
      this.getCreneauxArray(jourIndex).insert(creneauIndex + (i - startIndex), newCreneauGroup);
    }
  }

  removeCreneau(jourIndex: number, creneauIndex: number): void {
    this.getCreneauxArray(jourIndex).removeAt(creneauIndex);

    if (this.getCreneauxArray(jourIndex).length === 0) {
      this.joursArray.removeAt(jourIndex);
    }
  }

  onSubmit(): void {
    if (this.emploiForm.invalid) {
      this.markFormGroupTouched(this.emploiForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.emploiService.update(this.emploiId, this.emploiForm.value).subscribe({
      next: () => {
        Swal.fire({
          title: 'Succès!',
          text: 'Emploi du temps mis à jour avec succès',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/dashboard/emplois-du-temps']);
        });
      },
      error: (err: any) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Erreur!',
          text: 'Une erreur est survenue lors de la mise à jour',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        console.error(err);
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
