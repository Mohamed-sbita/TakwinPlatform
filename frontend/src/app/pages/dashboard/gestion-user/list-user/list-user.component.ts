import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  isLoading = true;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  roles = ['All', 'admin', 'formateur', 'stagiaire']; // Updated to match your user model
  selectedRole = 'All';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.list().subscribe({
      next: (data: any) => {
        this.users = data;
        this.filteredUsers = [...this.users];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading users', error);
        this.isLoading = false;
        this.showError('Failed to load users');
      }
    });
  }

  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        `${user.nom} ${user.prenom}`.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.codeInscription?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = this.selectedRole === 'All' || user.role === this.selectedRole;
      
      return matchesSearch && matchesRole;
    });
    this.currentPage = 1; // Reset to first page when filters change
  }

  async deleteUser(id: string) {
    const result = await Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#3498db',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      backdrop: `
        rgba(0,0,0,0.4)
        url("/assets/images/chef-hat.png")
        left top
        no-repeat
      `
    });

    if (result.isConfirmed) {
      this.userService.delete(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u._id !== id);
          this.applyFilters();
          Swal.fire({
            title: 'Deleted!',
            text: 'User has been deleted.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (error: any) => {
          console.error('Error deleting user', error);
          this.showError('Failed to delete user');
        }
      });
    }
  }

  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  getRoleBadgeClass(role: string) {
    switch (role) {
      case 'admin':
        return 'bg-danger';
      case 'formateur':
        return 'bg-primary';
      case 'stagiaire':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  formatDate(dateString: string | Date) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  private showError(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#3498db'
    });
  }
}