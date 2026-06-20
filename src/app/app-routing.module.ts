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
import { MesAnnoncesComponent } from './components/mes-annonces/mes-annonces.component';
import { FavorisComponent } from './components/favoris/favoris.component';
import { VendeurComponent } from './components/vendeur/vendeur.component';
import { DashboardProComponent } from './components/dashboard-pro/dashboard-pro.component';

import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  // Pages publiques
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'annonces', component: CatalogueComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Pages connectées (tout utilisateur authentifié)
  { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },
  { path: 'messagerie', component: MessagerieComponent, canActivate: [AuthGuard] },
  { path: 'avis', component: AvisComponent, canActivate: [AuthGuard] },
  { path: 'mes-annonces', component: MesAnnoncesComponent, canActivate: [AuthGuard] },
  { path: 'favoris', component: FavorisComponent, canActivate: [AuthGuard] },

  // Pages annonces — routes spécifiques AVANT la route dynamique :id
  { path: 'annonces/new', component: AnnonceFormComponent, canActivate: [AuthGuard] },
  { path: 'annonces/edit/:id', component: AnnonceFormComponent, canActivate: [AuthGuard] },
  { path: 'annonces/:id', component: AnnonceDetailComponent },
  { path: 'vendeur/:id', component: VendeurComponent },

  // Espace Pro
  { path: 'pro', component: DashboardProComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['entreprise'] } },

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
