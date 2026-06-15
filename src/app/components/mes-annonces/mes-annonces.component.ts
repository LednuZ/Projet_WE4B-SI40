import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnnonceService } from '../../services/annonce.service';
import { Annonce } from '../../models/annonce.model';

@Component({
  selector: 'app-mes-annonces',
  templateUrl: './mes-annonces.component.html',
  styleUrls: ['./mes-annonces.component.css']
})
export class MesAnnoncesComponent implements OnInit {

  annonces: Annonce[] = [];
  loading: boolean = true;
  message: string = '';
  messageType: string = '';
  confirmAction: { id: number; type: 'vendu' | 'supprimer' } | null = null;

  constructor(
    private annonceService: AnnonceService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadAnnonces();
  }

  loadAnnonces(): void {
    this.loading = true;
    this.annonceService.getMesAnnonces().subscribe({
      next: (data) => {
        this.annonces = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
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

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'active': return 'En ligne';
      case 'pause': return 'En pause';
      case 'vendu': return 'Vendu';
      case 'suspendu': return 'Suspendu';
      default: return statut;
    }
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'active': return 'statut-active';
      case 'pause': return 'statut-pause';
      case 'vendu': return 'statut-vendu';
      case 'suspendu': return 'statut-suspendu';
      default: return '';
    }
  }

  pauseAnnonce(id: number): void {
    this.annonceService.pauseAnnonce(id).subscribe({
      next: () => {
        this.showMessage('Annonce mise en pause', 'success');
        this.loadAnnonces();
      },
      error: (err: any) => this.showMessage(err.error?.message || 'Erreur', 'error')
    });
  }

  reprendreAnnonce(id: number): void {
    this.annonceService.reprendreAnnonce(id).subscribe({
      next: () => {
        this.showMessage('Annonce remise en ligne', 'success');
        this.loadAnnonces();
      },
      error: (err: any) => this.showMessage(err.error?.message || 'Erreur', 'error')
    });
  }

  marquerVendu(id: number): void {
    this.confirmAction = { id, type: 'vendu' };
  }

  supprimerAnnonce(id: number): void {
    this.confirmAction = { id, type: 'supprimer' };
  }

  confirmer(): void {
    if (!this.confirmAction) return;
    const { id, type } = this.confirmAction;
    this.confirmAction = null;

    if (type === 'vendu') {
      this.annonceService.marquerVendu(id).subscribe({
        next: () => {
          this.showMessage('Annonce marquée comme vendue. Félicitations !', 'success');
          this.loadAnnonces();
        },
        error: (err: any) => this.showMessage(err.error?.message || 'Erreur', 'error')
      });
    } else {
      this.annonceService.deleteAnnonce(id).subscribe({
        next: () => {
          this.showMessage('Annonce supprimée', 'success');
          this.loadAnnonces();
        },
        error: (err: any) => this.showMessage(err.error?.message || 'Erreur', 'error')
      });
    }
  }

  annulerConfirmation(): void {
    this.confirmAction = null;
  }

  showMessage(text: string, type: string): void {
    this.message = text;
    this.messageType = type;
    setTimeout(() => this.message = '', 4000);
  }
}