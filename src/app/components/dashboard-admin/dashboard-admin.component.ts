import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { LogService, LogEntry, LogAction } from '../../services/log.service';
import { FileMetadataService, FileMetadata } from '../../services/file-metadata.service';
import { AnalyticsService, Indicateurs } from '../../services/analytics.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit, OnDestroy {

  onglet: 'stats' | 'utilisateurs' | 'annonces' | 'avis' | 'catalogue' | 'logs' | 'fichiers' | 'analyses' = 'stats';

  // ── Analyses (Charts) ─────────────────────────────────────────────────────
  @ViewChild('chartActivite')  chartActiviteRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartActions')   chartActionsRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartHeures')    chartHeuresRef!: ElementRef<HTMLCanvasElement>;

  indicateurs: Indicateurs | null = null;
  analysesLoading = false;
  periodeJours = 30;

  private charts: Chart[] = [];

  // ── Logs (MongoDB) ────────────────────────────────────────────────────────
  logs: LogEntry[] = [];
  logsTotal = 0;
  logsPage = 1;
  readonly logsPageSize = 20;
  logsLoading = false;
  selectedAction = '';
  statsTotal = 0;
  statsByAction: { _id: string; count: number }[] = [];

  readonly allActions: LogAction[] = [
    'LOGIN', 'LOGOUT', 'REGISTER',
    'VIEW_ANNONCE', 'CREATE_ANNONCE', 'UPDATE_ANNONCE', 'DELETE_ANNONCE',
    'PAUSE_ANNONCE', 'RESUME_ANNONCE', 'SOLD_ANNONCE', 'UPLOAD_PHOTO',
    'ADD_FAVORI', 'REMOVE_FAVORI', 'SEND_MESSAGE'
  ];

  readonly keyStats = [
    { label: 'Connexions',          action: 'LOGIN' },
    { label: 'Inscriptions',        action: 'REGISTER' },
    { label: 'Annonces créées',     action: 'CREATE_ANNONCE' },
    { label: 'Annonces supprimées', action: 'DELETE_ANNONCE' },
    { label: 'Photos uploadées',    action: 'UPLOAD_PHOTO' },
    { label: 'Messages envoyés',    action: 'SEND_MESSAGE' },
  ];

  // ── Fichiers (MongoDB) ────────────────────────────────────────────────────
  files: FileMetadata[] = [];
  filesTotal = 0;
  filesPage = 1;
  readonly filesPageSize = 20;
  filesLoading = false;
  filesStatsTotal = 0;
  filesByType: { _id: string; count: number; totalSize: number }[] = [];
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
  avisVendeursFiltres: any[] = [];
  searchAvis = '';
  loadingAvis = true;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private logService: LogService,
    private fileMetaService: FileMetadataService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUser()?.id_utilisateur ?? 0;
    this.loadStats();
    this.loadUsers();
    this.loadAnnonces();
    this.loadAvis();
    this.loadLogStats();
    this.loadLogs();
    this.loadFileStats();
    this.loadFiles();
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
        this.avisVendeursFiltres = data.vendeurs;
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



  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency', currency: 'EUR', maximumFractionDigits: 0
    }).format(prix);
  }

  // ── Logs MongoDB ──────────────────────────────────────────────────────────

  loadLogStats(): void {
    this.logService.getStats().subscribe({
      next: data => { this.statsTotal = data.total; this.statsByAction = data.byAction; },
      error: () => {}
    });
  }

  loadLogs(): void {
    this.logsLoading = true;
    this.logService.getLogs({
      action: this.selectedAction || undefined,
      limit:  this.logsPageSize,
      skip:   (this.logsPage - 1) * this.logsPageSize
    }).subscribe({
      next: data => { this.logs = data.logs; this.logsTotal = data.total; this.logsLoading = false; },
      error: () => { this.logsLoading = false; }
    });
  }

  onFilterChange(): void { this.logsPage = 1; this.loadLogs(); }
  resetFilter(): void { this.selectedAction = ''; this.onFilterChange(); }

  get logsTotalPages(): number { return Math.ceil(this.logsTotal / this.logsPageSize); }
  prevLogsPage(): void { if (this.logsPage > 1) { this.logsPage--; this.loadLogs(); } }
  nextLogsPage(): void { if (this.logsPage < this.logsTotalPages) { this.logsPage++; this.loadLogs(); } }

  getStatCount(action: string): number {
    return this.statsByAction.find(s => s._id === action)?.count ?? 0;
  }

  formatDetails(details: Record<string, any>): string {
    if (!details || Object.keys(details).length === 0) return '—';
    return Object.entries(details).map(([k, v]) => `${k}: ${v}`).join(' | ');
  }

  // ── Fichiers MongoDB ──────────────────────────────────────────────────────

  loadFileStats(): void {
    this.fileMetaService.getStats().subscribe({
      next: data => { this.filesStatsTotal = data.total; this.filesByType = data.byType; },
      error: () => {}
    });
  }

  loadFiles(): void {
    this.filesLoading = true;
    this.fileMetaService.getFiles({ limit: this.filesPageSize, skip: (this.filesPage - 1) * this.filesPageSize }).subscribe({
      next: data => { this.files = data.files; this.filesTotal = data.total; this.filesLoading = false; },
      error: () => { this.filesLoading = false; }
    });
  }

  get filesTotalPages(): number { return Math.ceil(this.filesTotal / this.filesPageSize); }
  prevFilesPage(): void { if (this.filesPage > 1) { this.filesPage--; this.loadFiles(); } }
  nextFilesPage(): void { if (this.filesPage < this.filesTotalPages) { this.filesPage++; this.loadFiles(); } }

  formatSize(bytes: number): string {
    if (bytes < 1024)        return bytes + ' o';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
  }

  // ── Analyses ──────────────────────────────────────────────────────────────

  ngOnDestroy(): void {
    this.charts.forEach(c => c.destroy());
  }

  chargerAnalyses(): void {
    this.analysesLoading = true;
    this.charts.forEach(c => c.destroy());
    this.charts = [];

    forkJoin([
      this.analyticsService.getIndicateurs(),
      this.analyticsService.getActivite(this.periodeJours),
      this.analyticsService.getHeures()
    ]).subscribe({
      next: ([indicateurs, activite, heures]) => {
        this.indicateurs = indicateurs;
        this.analysesLoading = false;
        setTimeout(() => {
          this.buildChartActivite(activite);
          this.buildChartActions(indicateurs);
          this.buildChartHeures(heures);
        }, 50);
      },
      error: () => { this.analysesLoading = false; }
    });
  }

  private buildChartActivite(data: any): void {
    const ctx = this.chartActiviteRef?.nativeElement;
    if (!ctx) return;
    const couleurs: Record<string, string> = {
      LOGIN:           '#2563eb',
      VIEW_ANNONCE:    '#7c3aed',
      CREATE_ANNONCE:  '#16a34a',
      SOLD_ANNONCE:    '#ca8a04',
      UPLOAD_PHOTO:    '#db2777',
      SEND_MESSAGE:    '#0891b2',
    };
    const labels: Record<string, string> = {
      LOGIN: 'Connexions', VIEW_ANNONCE: 'Consultations',
      CREATE_ANNONCE: 'Publications', SOLD_ANNONCE: 'Ventes',
      UPLOAD_PHOTO: 'Photos', SEND_MESSAGE: 'Messages',
    };
    const datasets = Object.entries(data.series).map(([action, values]) => ({
      label: labels[action] ?? action,
      data: values as number[],
      borderColor: couleurs[action] ?? '#6b7280',
      backgroundColor: (couleurs[action] ?? '#6b7280') + '22',
      fill: true,
      tension: 0.3,
      pointRadius: 2,
    }));
    this.charts.push(new Chart(ctx, {
      type: 'line',
      data: { labels: data.dates, datasets },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' }, title: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    }));
  }

  private buildChartActions(ind: Indicateurs): void {
    const ctx = this.chartActionsRef?.nativeElement;
    if (!ctx) return;
    this.charts.push(new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Connexions', 'Consultations', 'Publications', 'Ventes', 'Messages', 'Favoris', 'Photos'],
        datasets: [{
          data: [ind.connexions, ind.consultations, ind.publications, ind.ventes, ind.messages, ind.favorisAjoutes, ind.photosUploadees],
          backgroundColor: ['#2563eb','#7c3aed','#16a34a','#ca8a04','#0891b2','#f97316','#db2777'],
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'right' } }
      }
    }));
  }

  private buildChartHeures(data: any): void {
    const ctx = this.chartHeuresRef?.nativeElement;
    if (!ctx) return;
    this.charts.push(new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.heures.map((h: any) => h.heure),
        datasets: [{
          label: 'Actions',
          data: data.heures.map((h: any) => h.count),
          backgroundColor: data.heures.map((_: any, i: number) => i >= 8 && i <= 22 ? '#2563eb99' : '#2563eb33'),
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    }));
  }
}
