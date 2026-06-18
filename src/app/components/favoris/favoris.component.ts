import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavoriService } from '../../services/favori.service';

@Component({
  selector: 'app-favoris',
  templateUrl: './favoris.component.html',
  styleUrls: ['./favoris.component.css']
})
export class FavorisComponent implements OnInit {

  favoris: any[] = [];
  loading = true;

  constructor(
    private favoriService: FavoriService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.favoriService.getFavoris().subscribe({
      next: (data: any[]) => {
        this.favoris = data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  retirer(annonceId: number, event: Event): void {
    event.stopPropagation();
    this.favoriService.removeFavori(annonceId).subscribe({
      next: () => {
        this.favoris = this.favoris.filter(f => f.id_annonce !== annonceId);
      },
      error: (err: any) => console.error(err)
    });
  }

  getPhotoUrl(annonce: any): string {
    return annonce.photo_principale
      ? 'http://localhost:8000' + annonce.photo_principale
      : 'assets/no-photo.svg';
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency', currency: 'EUR', maximumFractionDigits: 0
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
