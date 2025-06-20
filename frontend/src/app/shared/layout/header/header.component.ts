import { routes } from './../../../app.routes';
import { Component } from '@angular/core';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { Route, Router, RouterModule } from '@angular/router';
import { ActualiteService } from '../../../core/services/actualite.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  user: any;
  notifications: any[] = [];

  cn=this.notifications.length;
  constructor( private _auth: AuthenticationService , private act : ActualiteService ,private  route : Router ){}

  ngOnInit(): void {
    this.user = this._auth.getDataFromToken();
    console.log(this.user);
    this.loadNotifications();
    console.log('Notifications loaded:', this.notifications);
    setInterval(() => {
      this.loadNotifications();
    }, 5000); // 30000 ms = 30 secondes
    
    
    
  }

  logout(){
    localStorage.removeItem('token');
    window.location.reload();
  }
  markNotificationsAsRead(id: any) {
    this.act.lu(id).subscribe({
      next: (data: any) => {
        console.log('Notification marked as read:', data);
        this.loadNotifications(); // Reload notifications after marking one as read
      },
      error: (err) => {
        console.error('Error marking notification as read:', err);
      }
      
    });
          this.route.navigate(['/dashboard/voir-actualite']);

   

  }
  loadNotifications(){

    this.act.getallnotification().subscribe({
      next: (data: any) => {
        this.notifications = data;
        console.log(this.notifications);
      },
      error: (err) => {
        console.error('Error loading notifications:', err);
      }
    });

  }
}
