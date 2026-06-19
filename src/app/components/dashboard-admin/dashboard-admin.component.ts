import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  onglet: 'stats' | 'utilisateurs' | 'annonces' | 'avis' = 'stats';
  currentUserId = 0;

  // Stats
  stats: any = null;
  loadingStats = true;

  // Utilisateurs
  utilisateurs: any[] = [];
  utilisateursFiltres: any[] = [];
  searchUser = '';
  loadingUsers = true;

  // Annonces
  annonces: any[] = [];
  annoncesFiltrees: any[] = [];
  searchAnnonce = '';
  filtreStatut = '';
  loadingAnnonces = true;
  commentaireAdmin: { [id: number]: string } = {};
  showCommentaire: { [id: number]: boolean } = {};

  // Avis
  avisVendeurs: any[] = [];
  avisModeles: any[] = [];
  avisVendeursFiltres: any[] = [];
  avisModelesFiltres: any[] = [];
  searchAvis = '';
  ongletAvis: 'vendeurs' | 'modeles' = 'vendeurs';
  loadingAvis = true;

  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUser()?.id_utilisateur ?? 0;
    this.loadStats();
    this.loadUsers();
    this.loadAnnonces();
    this.loadAvis();
  }

  // Stats

  loadStats(): void {
    this.adminService.getStats().subscribe({
      next: (data: any) => { this.stats = data; this.loadingStats = false; },
      error: () => { this.loadingStats = false; }
    });
  }

  barWidth(value: number, data: any[], key: string): string {
    const max = Math.max(...data.map((d: any) => Number(d[key]) || 0));
    return max > 0 ? (Number(value) / max * 100) + '%' : '0%';
  }

  carburantColor(carburant: string): string {
    const map: { [k: string]: string } = {
      essence: '#f97316', diesel: '#2563eb', electr: '#16a34a',
      hybride: '#16a34a', gpl: '#a16207'
    };
    const c = (carburant ?? '').toLowerCase();
    for (const k of Object.keys(map)) {
      if (c.includes(k)) return map[k];
    }
    return '#6b7280';
  }

  statutColor(statut: string): string {
    const map: { [k: string]: string } = {
      active: '#16a34a', pause: '#a16207', vendu: '#2563eb', suspendu: '#e74c3c'
    };
    return map[statut] || '#6b7280';
  }

  percent(value: number, data: any[], key: string): string {
    const total = data.reduce((s: number, d: any) => s + Number(d[key] || 0), 0);
    return total > 0 ? (Number(value) / total * 100).toFixed(1) + '%' : '0%';
  }

  taux_conversion(): string {
    if (!this.stats?.total_annonces) return '0%';
    return (Number(this.stats.total_annonces_vendues) / Number(this.stats.total_annonces) * 100).toFixed(1) + '%';
  }

  // Utilisateurs

  loadUsers(): void {
    this.adminService.getUtilisateurs().subscribe({
      next: (data: any[]) => {
        this.utilisateurs = data;
        this.utilisateursFiltres = data;
        this.loadingUsers = false;
      },
      error: () => { this.loadingUsers = false; }
    });
  }

  filtrerUsers(): void {
    const q = this.searchUser.toLowerCase();
    this.utilisateursFiltres = this.utilisateurs.filter(u =>
      u.nom.toLowerCase().includes(q) ||
      u.prenom.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  }

  updateRole(user: any, role: string): void {
    this.adminService.updateRole(user.id_utilisateur, role).subscribe({
      next: () => { user.role = role; },
      error: (err: any) => console.error(err)
    });
  }

  deleteUser(userId: number): void {
    if (!confirm('Supprimer cet utilisateur définitivement ?')) return;
    this.adminService.deleteUtilisateur(userId).subscribe({
      next: () => {
        this.utilisateurs = this.utilisateurs.filter(u => Number(u.id_utilisateur) !== userId);
        this.filtrerUsers();
      },
      error: (err: any) => alert(err.error?.message || 'Erreur lors de la suppression')
    });
  }

  getRoleLabel(role: string): string {
    const map: { [k: string]: string } = {
      admin: 'Admin', particulier: 'Particulier', entreprise: 'Professionnel'
    };
    return map[role] || role;
  }

  // Annonces
  
  loadAnnonces(): void {
    this.adminService.getAnnonces().subscribe({
      next: (data: any[]) => {
        this.annonces = data;
        this.annoncesFiltrees = data;
        this.loadingAnnonces = false;
      },
      error: () => { this.loadingAnnonces = false; }
    });
  }

  filtrerAnnonces(): void {
    const q = this.searchAnnonce.toLowerCase();
    this.annoncesFiltrees = this.annonces.filter(a => {
      const matchSearch = !q || (a.marque_nom + ' ' + a.modele_nom).toLowerCase().includes(q)
        || (a.vendeur_nom + ' ' + a.vendeur_prenom).toLowerCase().includes(q);
      const matchStatut = !this.filtreStatut || a.statut === this.filtreStatut;
      return matchSearch && matchStatut;
    });
  }

  suspendre(annonce: any): void {
    this.showCommentaire[annonce.id_annonce] = true;
  }

  confirmerSuspension(annonce: any): void {
    const commentaire = this.commentaireAdmin[annonce.id_annonce] || '';
    this.adminService.updateStatutAnnonce(annonce.id_annonce, 'suspendu', commentaire).subscribe({
      next: () => {
        annonce.statut = 'suspendu';
        annonce.commentaire_admin = commentaire;
        this.showCommentaire[annonce.id_annonce] = false;
      },
      error: (err: any) => console.error(err)
    });
  }

  reactiver(annonce: any): void {
    this.adminService.updateStatutAnnonce(annonce.id_annonce, 'active', undefined).subscribe({
      next: () => { annonce.statut = 'active'; annonce.commentaire_admin = null; },
      error: (err: any) => console.error(err)
    });
  }

  deleteAnnonce(annonceId: number): void {
    if (!confirm('Supprimer cette annonce définitivement ?')) return;
    this.adminService.deleteAnnonce(annonceId).subscribe({
      next: () => {
        this.annonces = this.annonces.filter(a => Number(a.id_annonce) !== annonceId);
        this.filtrerAnnonces();
      },
      error: (err: any) => alert(err.error?.message || 'Erreur lors de la suppression')
    });
  }

  // ── Avis ──────────────────────────────────────────────────────────────────

  loadAvis(): void {
    this.adminService.getAvis().subscribe({
      next: (data: { vendeurs: any[]; modeles: any[] }) => {
        this.avisVendeurs = data.vendeurs;
        this.avisModeles  = data.modeles;
        this.avisVendeursFiltres = data.vendeurs;
        this.avisModelesFiltres  = data.modeles;
        this.loadingAvis = false;
      },
      error: () => { this.loadingAvis = false; }
    });
  }

  filtrerAvis(): void {
    const q = this.searchAvis.toLowerCase();
    this.avisVendeursFiltres = this.avisVendeurs.filter(a =>
      (a.redacteur_nom + ' ' + a.redacteur_prenom + ' ' + a.cible_nom).toLowerCase().includes(q)
    );
    this.avisModelesFiltres = this.avisModeles.filter(a =>
      (a.redacteur_nom + ' ' + a.redacteur_prenom + ' ' + a.cible_nom).toLowerCase().includes(q)
    );
  }

  supprimerAvisVendeur(avisId: number): void {
    if (!confirm('Supprimer cet avis ?')) return;
    this.adminService.deleteAvisVendeur(avisId).subscribe({
      next: () => {
        this.avisVendeurs = this.avisVendeurs.filter(a => Number(a.id) !== avisId);
        this.filtrerAvis();
      },
      error: (err: any) => alert(err.error?.message || 'Erreur lors de la suppression')
    });
  }

  supprimerAvisModele(avisId: number): void {
    if (!confirm('Supprimer cet avis ?')) return;
    this.adminService.deleteAvisModele(avisId).subscribe({
      next: () => {
        this.avisModeles = this.avisModeles.filter(a => Number(a.id) !== avisId);
        this.filtrerAvis();
      },
      error: (err: any) => alert(err.error?.message || 'Erreur lors de la suppression')
    });
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency', currency: 'EUR', maximumFractionDigits: 0
    }).format(prix);
  }
}
