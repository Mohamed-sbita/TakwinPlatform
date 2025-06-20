import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ActualiteService } from '../../../../core/services/actualite.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from '../../../../core/auth/authentication.service';

@Component({
  selector: 'app-view-actualite',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './view-actualite.component.html',
  styleUrls: ['./view-actualite.component.css'],
  providers: [DatePipe]
})
export class ViewActualiteComponent implements OnInit {
  actualite: any;
  isLoading: boolean = true;
  error: string | null = null;
  sanitizedContent: SafeHtml = '';
  user : any;

  constructor(
    private route: ActivatedRoute,
    private actualiteService: ActualiteService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
     private _auth: AuthenticationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadActualite(id);
    this.user = this._auth.getDataFromToken();
  }

  loadActualite(id: string): void {
    this.isLoading = true;
    this.actualiteService.byid(id).subscribe({
      next: (data: any) => {
        this.actualite = data;
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

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'mediumDate') || '';
  }

  getImageUrl(imagePath: string): string {
    return 'http://127.0.0.1:3000/files/' + imagePath ;
  }

  getAttachmentUrl(attachmentPath: string): string {
    return 'http://127.0.0.1:3000/files/' + attachmentPath;
  }
}