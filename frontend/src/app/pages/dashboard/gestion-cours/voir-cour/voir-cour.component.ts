import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ActualiteService } from '../../../../core/services/actualite.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-voir-cour',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './voir-cour.component.html',
  styleUrl: './voir-cour.component.css'
})
export class VoirCourComponent {
  cours: any;
  isLoading: boolean = true;
  error: string | null = null;
  sanitizedContent: SafeHtml = '';

  constructor(
    private route: ActivatedRoute,
    private actualiteService: ActualiteService,
    private sanitizer: DomSanitizer,
    // private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadActualite(id);
  }

  loadActualite(id: string): void {
    this.isLoading = true;
    this.actualiteService.getCoursById(id).subscribe({
      next: (data: any) => {
        this.cours = data;
        console.log(this.cours);
        
        this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(data.content);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load actualité';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // formatDate(date: string): string {
  //   return this.datePipe.transform(date, 'mediumDate') || '';
  // }

 
  getAttachmentUrl(attachmentPath: string): string {
    return 'http://127.0.0.1:3000/files/' + attachmentPath;
  }
}
