import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProService } from '../../services/pro.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-pro',
  templateUrl: './dashboard-pro.component.html',
  styleUrls: ['./dashboard-pro.component.css']
})
export class DashboardProComponent implements OnInit {

  stats: any = null;
  annonces: any[] = [];
  annoncesFiltrees: any[] = [];
  loadingStats = true;
  loadingAnnonces = true;

  searchAnnonce = '';
  sortCol = 'date_creation';
  sortAsc = false;

  nomVendeur = '';

  constructor(
    private proService: ProService,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) this.nomVendeur = `${user.prenom} ${user.nom}`;

    this.proService.getStats().subscribe({
      next: (data: any) => { this.stats = data; this.loadingStats = false; },
      error: () => { this.loadingStats = false; }
    });

    this.proService.getAnnonces().subscribe({
      next: (data: any[]) => {
        this.annonces = data;
        this.annoncesFiltrees = data;
        this.loadingAnnonces = false;
      },
      error: () => { this.loadingAnnonces = false; }
    });
  }

  // ── Graphiques ────────────────────────────────────────────────────────────

  barWidth(value: number, data: any[], key: string): string {
    const max = Math.max(...data.map((d: any) => Number(d[key]) || 0));
    return max > 0 ? (Number(value) / max * 100) + '%' : '0%';
  }

  percent(value: number, data: any[], key: string): string {
    const total = data.reduce((s: number, d: any) => s + Number(d[key] || 0), 0);
    return total > 0 ? (Number(value) / total * 100).toFixed(0) + '%' : '0%';
  }

  statutColor(statut: string): string {
    const map: { [k: string]: string } = {
      active: '#16a34a', pause: '#a16207', vendu: '#2563eb', suspendu: '#e74c3c'
    };
    return map[statut] || '#6b7280';
  }

  // ── Tableau annonces ──────────────────────────────────────────────────────

  filtrer(): void {
    const q = this.searchAnnonce.toLowerCase();
    this.annoncesFiltrees = this.annonces.filter(a =>
      !q ||
      (a.marque_nom + ' ' + a.modele_nom).toLowerCase().includes(q) ||
      a.statut.toLowerCase().includes(q)
    );
  }

  trier(col: string): void {
    if (this.sortCol === col) { this.sortAsc = !this.sortAsc; }
    else { this.sortCol = col; this.sortAsc = true; }

    this.annoncesFiltrees = [...this.annoncesFiltrees].sort((a, b) => {
      const va = a[col] ?? 0;
      const vb = b[col] ?? 0;
      const res = va < vb ? -1 : va > vb ? 1 : 0;
      return this.sortAsc ? res : -res;
    });
  }

  sortIcon(col: string): string {
    if (this.sortCol !== col) return '⇅';
    return this.sortAsc ? '↑' : '↓';
  }

  // ── Utilitaires ───────────────────────────────────────────────────────────

  getPhotoUrl(a: any): string {
    return a.photo_principale ? 'http://localhost:8000' + a.photo_principale : 'assets/no-photo.svg';
  }

  formatPrix(p: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency', currency: 'EUR', maximumFractionDigits: 0
    }).format(p ?? 0);
  }

  formatKm(km: number): string {
    return new Intl.NumberFormat('fr-FR').format(km) + ' km';
  }

  etoiles(note: number): string[] {
    return Array.from({ length: 5 }, (_, i) => (i < Math.round(note) ? '★' : '☆'));
  }

  contacterAnnonce(annonceId: number): void {
    this.router.navigate(['/messagerie'], { queryParams: { annonce: annonceId } });
  }
}
