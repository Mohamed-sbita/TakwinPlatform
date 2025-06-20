import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatiereService } from '../../../../core/services/matiere.service';
import { UserService } from '../../../../core/services/user.service';
import { ClasseService } from '../../../../core/services/classe.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-matiere',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './edit-matiere.component.html',
  styleUrls: ['./edit-matiere.component.css']
})
export class EditMatiereComponent implements OnInit {
  matiereForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  formateurs: any[] = [];
  classes: any[] = [];
  selectedClasses: string[] = [];
  matiereId: string = '';

  constructor(
    private fb: FormBuilder,
    private matiereService: MatiereService,
    private userService: UserService,
    private classeService: ClasseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.matiereForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      formateur: [''],
      classes: [[]]
    });
  }

  ngOnInit(): void {
    this.matiereId = this.route.snapshot.params['id'];
    this.loadFormateurs();
    this.loadClasses();
    this.loadMatiere();
  }

  loadMatiere(): void {
    this.isLoading = true;
    this.matiereService.byId(this.matiereId).subscribe({
      next: (matiere: any) => {
        this.matiereForm.patchValue({
          nom: matiere.nom,
          description: matiere.description,
          formateur: matiere.formateur?._id || ''
        });
        
        if (matiere.classes && matiere.classes.length > 0) {
          this.selectedClasses = matiere.classes.map((c: any) => c._id);
          this.matiereForm.patchValue({ classes: this.selectedClasses });
        }
        
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement de la matière';
        console.error(err);
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

  toggleClassSelection(classeId: string): void {
    if (this.selectedClasses.includes(classeId)) {
      this.selectedClasses = this.selectedClasses.filter(id => id !== classeId);
    } else {
      this.selectedClasses.push(classeId);
    }
    this.matiereForm.patchValue({ classes: this.selectedClasses });
  }

  onSubmit(): void {
    if (this.matiereForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const updatedMatiere = {
      ...this.matiereForm.value,
      classes: this.selectedClasses
    };

    this.matiereService.update(this.matiereId, updatedMatiere).subscribe({
      next: () => {
        Swal.fire({
          title: 'Succès!',
          text: 'La matière a été mise à jour avec succès',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/dashboard/matieres']);
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

  get nom() {
    return this.matiereForm.get('nom');
  }
}