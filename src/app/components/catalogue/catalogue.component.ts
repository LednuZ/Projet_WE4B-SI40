import { Component, OnInit } from '@angular/core';
import { AnnonceService } from '../../services/annonce.service';
import { Annonce } from '../../models/annonce.model';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {

  annonces: Annonce[] = [];
  marques: any[] = [];
  loading: boolean = true;
  showFilters: boolean = false;

  // Filtres
  filters: any = {
    marque_id: '',
    prix_min: '',
    prix_max: '',
    km_max: '',
    annee_min: '',
    annee_max: ''
  };

  // Tri
  sort: string = 'recent';

  constructor(private annonceService: AnnonceService) {}

  ngOnInit(): void {
    this.loadMarques();
    this.loadAnnonces();
  }

  loadMarques(): void {
    this.annonceService.getMarques().subscribe({
      next: (data) => this.marques = data,
      error: (err) => console.error('Erreur chargement marques', err)
    });
  }

  loadAnnonces(): void {
    this.loading = true;
    this.annonceService.getAnnonces(this.filters, this.sort).subscribe({
      next: (data) => {
        this.annonces = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement annonces', err);
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.loadAnnonces();
  }

  onSortChange(sort: string): void {
    this.sort = sort;
    this.loadAnnonces();
  }

  resetFilters(): void {
    this.filters = {
      marque_id: '',
      prix_min: '',
      prix_max: '',
      km_max: '',
      annee_min: '',
      annee_max: ''
    };
    this.sort = 'recent';
    this.loadAnnonces();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
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