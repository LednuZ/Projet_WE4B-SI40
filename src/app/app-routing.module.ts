import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CatalogueComponent } from './components/catalogue/catalogue.component';
import { AnnonceDetailComponent } from './components/annonce-detail/annonce-detail.component';
import { AnnonceFormComponent } from './components/annonce-form/annonce-form.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProfilComponent } from './components/profil/profil.component';
import { MessagerieComponent } from './components/messagerie/messagerie.component';
import { AvisComponent } from './components/avis/avis.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';

import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  // Pages publiques
  { path: '', component: CatalogueComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Pages connectées (tout utilisateur authentifié)
  { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },
  { path: 'messagerie', component: MessagerieComponent, canActivate: [AuthGuard] },
  { path: 'avis', component: AvisComponent, canActivate: [AuthGuard] },

  // Pages annonces — routes spécifiques AVANT la route dynamique :id
  { path: 'annonces/new', component: AnnonceFormComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['particulier', 'entreprise', 'admin'] } },
  { path: 'annonces/edit/:id', component: AnnonceFormComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['particulier', 'entreprise', 'admin'] } },
  { path: 'annonces/:id', component: AnnonceDetailComponent },

  // Admin
  { path: 'admin', component: DashboardAdminComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin'] } },

  // Redirection si route inconnue
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }