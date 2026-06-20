import { Component, OnInit } from '@angular/core';
import { AnnonceService } from '../../services/annonce.service';
import { Annonce } from '../../models/annonce.model';

import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  annoncesRecentes: Annonce[] = [];
  marques: any[] = [];
  selectedMarqueId: string = '';
  loading: boolean = true;

  constructor(
    private annonceService: AnnonceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load recent announcements
    this.annonceService.getAnnonces({}, 'recent').subscribe({
      next: (data) => {
        this.annoncesRecentes = data.slice(0, 6);
        this.loading = false;
      },
      error: () => this.loading = false
    });

    // Load brands for search
    this.annonceService.getMarques().subscribe({
      next: (data) => {
        this.marques = data;
      },
      error: () => {}
    });
  }

  triggerSearch(): void {
    if (this.selectedMarqueId) {
      this.router.navigate(['/annonces'], { queryParams: { marque_id: this.selectedMarqueId } });
    } else {
      this.router.navigate(['/annonces']);
    }
  }

  getPhotoUrl(annonce: any): string {
    if (annonce.photo_principale) {
      return 'http://localhost:8000' + annonce.photo_principale;
    }
    return 'assets/no-photo.svg';
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(prix);
  }

  formatKm(km: number): string {
    return new Intl.NumberFormat('fr-FR').format(km) + ' km';
  }

  getCarburantClass(carburant: string): string {
    const c = (carburant ?? '').toLowerCase();
    if (c.includes('électr') || c.includes('electr')) return 'energy-elec';
    if (c.includes('hybride'))                          return 'energy-hybrid';
    if (c.includes('diesel'))                           return 'energy-diesel';
    return 'energy-essence';
  }
}