import { Component, OnInit } from '@angular/core';
import { AnnonceService } from '../../services/annonce.service';
import { Annonce } from '../../models/annonce.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  annoncesRecentes: Annonce[] = [];
  loading: boolean = true;

  constructor(private annonceService: AnnonceService) {}

  ngOnInit(): void {
    this.annonceService.getAnnonces({}, 'recent').subscribe({
      next: (data) => {
        this.annoncesRecentes = data.slice(0, 6);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  getPhotoUrl(annonce: any): string {
    if (annonce.photo_principale) {
      return 'http://localhost:8000' + annonce.photo_principale;
    }
    return 'assets/no-photo.png';
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
}