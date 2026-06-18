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
import { VitrineComponent } from './vitrine/vitrine.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MesAnnoncesComponent } from './components/mes-annonces/mes-annonces.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { FavorisComponent } from './components/favoris/favoris.component';
import { StarRatingComponent } from './components/shared/star-rating/star-rating.component';
import { VendeurComponent } from './components/vendeur/vendeur.component';

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
    FooterComponent,
    MesAnnoncesComponent,
    VitrineComponent,
    HeaderComponent,
    HomeComponent,
    FavorisComponent,
    StarRatingComponent,
    VendeurComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }