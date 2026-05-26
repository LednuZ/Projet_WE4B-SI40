import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { CatalogueComponent } from './components/catalogue/catalogue.component';
import { AnnonceDetailComponent } from './components/annonce-detail/annonce-detail.component';
import { AnnonceFormComponent } from './components/annonce-form/annonce-form.component';
import { ProfilComponent } from './components/profil/profil.component';
import { MessagerieComponent } from './components/messagerie/messagerie.component';
import { AvisComponent } from './components/avis/avis.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    CatalogueComponent,
    AnnonceDetailComponent,
    AnnonceFormComponent,
    ProfilComponent,
    MessagerieComponent,
    AvisComponent,
    DashboardAdminComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
