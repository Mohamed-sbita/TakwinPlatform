import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../../core/services/contact.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './listmessage.component.html',
  styleUrls: ['./listmessage.component.css']
})


export class ListeMessagesComponent implements OnInit {
  messages: any[] = [];
  loading = true;
  error = '';
  selectedMessage: any = null;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.contactService.getMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur de chargement';
        this.loading = false;
      }
    });
  }

  openModal(message: any): void {
    this.selectedMessage = message;
    // La modal s'ouvrira via data-bs-toggle dans le template
  }

  deleteMessage(id: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas annuler cette action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.contactService.deleteMessage(id).subscribe({
          next: () => {
            this.loadMessages();
            Swal.fire(
              'Supprimé!',
              'Le message a été supprimé.',
              'success'
            );
          },
          error: (err) => {
            Swal.fire(
              'Erreur!',
              'La suppression a échoué.',
              'error'
            );
          }
        });
      }
    });
  }
}