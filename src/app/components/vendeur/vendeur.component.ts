import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-vendeur',
  templateUrl: './vendeur.component.html',
  styleUrls: ['./vendeur.component.css']
})
export class VendeurComponent implements OnInit {

  utilisateur: any = null;
  stats: any = null;
  avis: any[] = [];
  annonces: any[] = [];
  loading = true;
  error = '';

  private apiUrl = 'http://localhost:8000/api';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id && id !== 0) { this.router.navigate(['/']); return; }

    this.http.get<any>(`${this.apiUrl}/vendeur/${id}`).subscribe({
      next: (data: any) => {
        this.utilisateur = data.utilisateur;
        this.stats       = data.stats;
        this.avis        = data.avis;
        this.annonces    = data.annonces;
        this.loading     = false;
      },
      error: () => {
        this.error   = 'Profil introuvable';
        this.loading = false;
      }
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

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }

  getRoleLabel(role: string): string {
    const map: { [k: string]: string } = {
      admin: 'Administrateur', particulier: 'Particulier', entreprise: 'Entreprise'
    };
    return map[role] || role;
  }

  getCarburantClass(carburant: string): string {
    const c = (carburant ?? '').toLowerCase();
    if (c.includes('électr') || c.includes('electr')) return 'energy-elec';
    if (c.includes('hybride'))                          return 'energy-hybrid';
    if (c.includes('diesel'))                           return 'energy-diesel';
    return 'energy-essence';
  }
}
