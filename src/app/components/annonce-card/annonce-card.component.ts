import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Annonce } from '../../models/annonce.model';

@Component({
  selector: 'app-annonce-card',
  templateUrl: './annonce-card.component.html',
  styleUrls: ['./annonce-card.component.css']
})
export class AnnonceCardComponent {
  @Input() annonce!: Annonce;
  @Input() isLoggedIn: boolean = false;
  @Input() isFavori: boolean = false;
  
  @Output() toggleFavori = new EventEmitter<number>();

  onToggleFavoriClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleFavori.emit(this.annonce.id_annonce);
  }

  getPhotoUrl(): string {
    return this.annonce.photo_principale
      ? 'http://localhost:8000' + this.annonce.photo_principale
      : 'assets/no-photo.svg';
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
