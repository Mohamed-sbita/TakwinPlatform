import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ RouterModule, CommonModule ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  user: any;

  // cuisinier
  // chef-cuisinier
  // gestionnaire-de-stock

  constructor( private _auth: AuthenticationService ){}

  ngOnInit(): void {
    this.user = this._auth.getDataFromToken();
  }


}
