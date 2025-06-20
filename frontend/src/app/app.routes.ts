import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { dashGuard } from './core/guards/dash.guard';
import { loginGuard } from './core/guards/login.guard';
import { GestionUserComponent } from './pages/dashboard/gestion-user/gestion-user.component';
import { ListUserComponent } from './pages/dashboard/gestion-user/list-user/list-user.component';
import { CreateUserComponent } from './pages/dashboard/gestion-user/create-user/create-user.component';
import { EditUserComponent } from './pages/dashboard/gestion-user/edit-user/edit-user.component';
import { ProfileComponent } from './pages/dashboard/profile/profile.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { GestionActualiteComponent } from './pages/dashboard/gestion-actualite/gestion-actualite.component';
import { ListActualiteComponent } from './pages/dashboard/gestion-actualite/list-actualite/list-actualite.component';
import { CreateActualiteComponent } from './pages/dashboard/gestion-actualite/create-actualite/create-actualite.component';
import { EditActualiteComponent } from './pages/dashboard/gestion-actualite/edit-actualite/edit-actualite.component';
import { ViewActualiteComponent } from './pages/dashboard/gestion-actualite/view-actualite/view-actualite.component';
import { PublicActualiteComponent } from './pages/dashboard/gestion-actualite/public-actualite/public-actualite.component';
import { GestionDepartmentComponent } from './pages/dashboard/gestion-department/gestion-department.component';
import { ListDepartmentComponent } from './pages/dashboard/gestion-department/list-department/list-department.component';
import { CreateDepartmentComponent } from './pages/dashboard/gestion-department/create-department/create-department.component';
import { EditDepartmentComponent } from './pages/dashboard/gestion-department/edit-department/edit-department.component';
import { GestionClasseComponent } from './pages/dashboard/gestion-classe/gestion-classe.component';
import { ListClasseComponent } from './pages/dashboard/gestion-classe/list-classe/list-classe.component';
import { CreateClasseComponent } from './pages/dashboard/gestion-classe/create-classe/create-classe.component';
import { EditClasseComponent } from './pages/dashboard/gestion-classe/edit-classe/edit-classe.component';
import { GestionGroupeComponent } from './pages/dashboard/gestion-groupe/gestion-groupe.component';
import { ListGroupeComponent } from './pages/dashboard/gestion-groupe/list-groupe/list-groupe.component';
import { CreateGroupeComponent } from './pages/dashboard/gestion-groupe/create-groupe/create-groupe.component';
import { EditGroupeComponent } from './pages/dashboard/gestion-groupe/edit-groupe/edit-groupe.component';
import { GestionMatiereComponent } from './pages/dashboard/gestion-matiere/gestion-matiere.component';
import { ListMatiereComponent } from './pages/dashboard/gestion-matiere/list-matiere/list-matiere.component';
import { CreateMatiereComponent } from './pages/dashboard/gestion-matiere/create-matiere/create-matiere.component';
import { EditMatiereComponent } from './pages/dashboard/gestion-matiere/edit-matiere/edit-matiere.component';
import { GestionEmploisComponent } from './pages/dashboard/gestion-emplois/gestion-emplois.component';
import { ListEmploisComponent } from './pages/dashboard/gestion-emplois/list-emplois/list-emplois.component';
import { CreateEmploisComponent } from './pages/dashboard/gestion-emplois/create-emplois/create-emplois.component';
import { EditEmploisComponent } from './pages/dashboard/gestion-emplois/edit-emplois/edit-emplois.component';
import { ViewEmploisComponent } from './pages/dashboard/gestion-emplois/view-emplois/view-emplois.component';
import { GestionAttendanceComponent } from './pages/dashboard/gestion-attendance/gestion-attendance.component';
import { ListSessionComponent } from './pages/dashboard/gestion-attendance/list-session/list-session.component';
import { CreateSessionComponent } from './pages/dashboard/gestion-attendance/create-session/create-session.component';
import { CreateAttendanceComponent } from './pages/dashboard/gestion-attendance/create-attendance/create-attendance.component';
import { ListAttendanceComponent } from './pages/dashboard/gestion-attendance/list-attendance/list-attendance.component';
import { StatsComponent } from './pages/dashboard/stats/stats.component';
import { SendmessageComponent } from './pages/dashboard/sendmessage/sendmessage.component';
import { ListeMessagesComponent } from './pages/dashboard/listmessage/listmessage.component';
import { UserEmploisComponent } from './pages/dashboard/gestion-emplois/user-emplois/user-emplois.component';
import { RequestAttestationComponent } from './pages/dashboard/resquest-attestation/resquest-attestation.component';
import { ListAttestationComponent } from './pages/dashboard/list-attestation/list-attestation.component';
import { FormateurEmploisComponent } from './pages/dashboard/gestion-emplois/formateur-emplois/formateur-emplois.component';
import { StagiaireAbsencesComponent } from './pages/dashboard/gestion-attendance/stagiaire-absences/stagiaire-absences.component';
import { AdminPresenceManagementComponent } from './pages/dashboard/gestion-attendance/admin-absences/admin-absences.component';
import { GestionCoursComponent } from './pages/dashboard/gestion-cours/gestion-cours.component';
import { ListCoursComponent } from './pages/dashboard/gestion-cours/list-cours/list-cours.component';
import { CreateCoursComponent } from './pages/dashboard/gestion-cours/create-cours/create-cours.component';
import { EditCoursComponent } from './pages/dashboard/gestion-cours/edit-cours/edit-cours.component';
import { VoirCourComponent } from './pages/dashboard/gestion-cours/voir-cour/voir-cour.component';
import { PublicCoursComponent } from './pages/dashboard/gestion-cours/public-cours/public-cours.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'dashboard',
    canActivate: [dashGuard],
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'statistics', pathMatch: 'full' },

      { path: 'statistics', component: StatsComponent },
      { path: 'profile', component: ProfileComponent },


      {
        path: 'utilisateur',
        component: GestionUserComponent,
        children: [
          { path: '', component: ListUserComponent },
          { path: 'create', canActivate: [adminGuard], component: CreateUserComponent },
          { path: 'edit/:id', canActivate: [adminGuard], component: EditUserComponent },
        ],
      },

      { path: 'voir-actualite' , component: PublicActualiteComponent },
      {
        path: 'actualite',
        component: GestionActualiteComponent,
        children: [
          { path: '', component: ListActualiteComponent },
          { path: 'create', canActivate: [adminGuard], component: CreateActualiteComponent },
          { path: 'edit/:id', canActivate: [adminGuard], component: EditActualiteComponent },
          { path: 'view/:id', component: ViewActualiteComponent },
        ],
      },


      { path: 'voir-cours' , component: PublicCoursComponent },

      {
        path: 'cours',
        component: GestionCoursComponent,
        children: [
          { path: '', component: ListCoursComponent },
          { path: 'create', component: CreateCoursComponent },
          { path: 'edit/:id', component: EditCoursComponent },
          { path: 'vieww/:id', component: VoirCourComponent },
        ],
      },




      {
        path: 'department',
        component: GestionDepartmentComponent,
        children: [
          { path: '', component: ListDepartmentComponent },
          { path: 'create', canActivate: [adminGuard], component: CreateDepartmentComponent },
          { path: 'edit/:id', canActivate: [adminGuard], component: EditDepartmentComponent }
        ],
      },
      {
        path: 'classes',
        component: GestionClasseComponent,
        children: [
          { path: '', component: ListClasseComponent },
          { path: 'create', canActivate: [adminGuard], component: CreateClasseComponent },
          { path: 'edit/:id', canActivate: [adminGuard], component: EditClasseComponent }
        ],
      },
      {
        path: 'groupes',
        component: GestionGroupeComponent,
        children: [
          { path: '', component: ListGroupeComponent },
          { path: 'create', canActivate: [adminGuard], component: CreateGroupeComponent },
          { path: 'edit/:id',  canActivate: [adminGuard],component: EditGroupeComponent }
        ],
      },
      {
        path: 'matieres',
        component: GestionMatiereComponent,
        children: [
          { path: '', component: ListMatiereComponent },
          { path: 'create', canActivate: [adminGuard], component: CreateMatiereComponent },
          { path: 'edit/:id', canActivate: [adminGuard], component: EditMatiereComponent }
        ],
      },
      {
        path: 'emplois-du-temps',
        component: GestionEmploisComponent,
        children: [
          { path: '', component: ListEmploisComponent },
          { path: 'create', canActivate: [adminGuard], component: CreateEmploisComponent },
          { path: 'edit/:id', canActivate: [adminGuard], component: EditEmploisComponent },
          { path: 'view/:id', component: ViewEmploisComponent },
          { path: 'my', component: UserEmploisComponent },
          { path: 'formateur', component: FormateurEmploisComponent },
        ],
      },
      {
        path: 'sessions', component: GestionAttendanceComponent , children: [

          { path: '' , component: ListSessionComponent },
          { path: 'new' , component: CreateSessionComponent },
          { path: ':id/mark' , component: CreateAttendanceComponent },
          { path: ':id/view', component: ListAttendanceComponent }

        ]
      },
      { path: 'send' , component: SendmessageComponent },
      { path: 'boite' , component: ListeMessagesComponent },

      { path: 'request-attestation' , component: RequestAttestationComponent },
      { path: 'attestations' ,  canActivate: [adminGuard],component: ListAttestationComponent },

      { path: 'mes-absences' , component: StagiaireAbsencesComponent },
      { path: 'gestion-absences' , component: AdminPresenceManagementComponent },


    ],
  },

  { path: 'login', canActivate: [loginGuard], component: LoginComponent },

  { path: 'forgot-password', canActivate: [loginGuard], component: ForgotPasswordComponent },
  { path: 'reset-password/:token',canActivate: [loginGuard], component: ResetPasswordComponent },
  
  { path: '**', component: NotfoundComponent },
];
