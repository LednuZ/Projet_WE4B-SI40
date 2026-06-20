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

  // Catalogue
  catOnglet: 'marques' | 'types' | 'modeles' | 'generations' | 'reservoirs' | 'moteurs' | 'coffres' | 'versions' = 'marques';
  marques: any[] = [];
  marqueForm: any = { nom: '', pays: '', continent: '', date_creation: '', description: '', createur: '' };
  editingMarque: any = null;  showAddMarque = false;
  types: any[] = [];     typeForm: any = { nom: '' };               editingType: any = null;    showAddType = false;
  modeles: any[] = [];   modeleForm: any = { nom: '', id_marque: '', id_type: '', annee_creation: '' }; editingModele: any = null; showAddModele = false;
  generations: any[] = []; generationForm: any = { nom: '', id_modele: '', date_sortie: '' }; editingGeneration: any = null; showAddGeneration = false;
  reservoirs: any[] = [];  reservoirForm: any = { volume: '', type: '', id_marque: '' }; editingReservoir: any = null; showAddReservoir = false;
  moteurs: any[] = [];     moteurForm: any = { nom: '', puissance_DIN: '', puissance_fiscale: '', cylindree: '', couple_cumul: '', nombre_cylindre: '', nombre_soupapes_cyclindre: '', alimentation: '', type_suralimentation: '', id_marque: '' }; editingMoteur: any = null; showAddMoteur = false;
  coffres: any[] = [];     coffreForm: any = { volume: '' }; editingCoffre: any = null; showAddCoffre = false;
  versions: any[] = [];    versionForm: any = { nom: '', id_generation: '', id_reservoir: '', id_coffre: '', transmission: '', boite_vitesse: '', nombre_rapport: '', nombre_places: '', nombre_portes: '', vitesse_max: '', consomation_mixte: '', emission_CO2: '', Norme_euro: '', Crit_air: '', hauteur: '', empattement: '', poids_vide: '', suspension_avant: '', suspension_arriere: '', freins_avant: '', freins_arriere: '' }; editingVersion: any = null; showAddVersion = false;
  expandedVersion: any = null;  versionMoteurs: any[] = []; addMoteurId = '';
  catLoading = false;
  catError = '';

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

  // ── Catalogue ──────────────────────────────────────────────────────────────

  loadCatalogue(): void {
    this.catLoading = true;
    this.catError = '';
    forkJoin([
      this.adminService.getMarques(),
      this.adminService.getTypes(),
      this.adminService.getModeles(),
      this.adminService.getGenerations(),
      this.adminService.getReservoirs(),
      this.adminService.getMoteurs(),
      this.adminService.getCoffres(),
      this.adminService.getVersions(),
    ]).subscribe({
      next: ([m, t, mo, g, r, mot, c, v]: any[]) => {
        this.marques     = m   ?? [];
        this.types       = t   ?? [];
        this.modeles     = mo  ?? [];
        this.generations = g   ?? [];
        this.reservoirs  = r   ?? [];
        this.moteurs     = mot ?? [];
        this.coffres     = c   ?? [];
        this.versions    = v   ?? [];
        this.catLoading  = false;
      },
      error: () => { this.catLoading = false; this.catError = 'Erreur de chargement'; }
    });
  }

  // Marques
  saveMarque(): void {
    if (!this.marqueForm.nom.trim()) return;
    const obs = this.editingMarque
      ? this.adminService.updateMarque(this.editingMarque.id_marque, this.marqueForm)
      : this.adminService.createMarque(this.marqueForm);
    obs.subscribe({
      next: (res: any) => {
        if (this.editingMarque) {
          Object.assign(this.editingMarque, this.marqueForm);
        } else {
          this.marques = [...this.marques, { id_marque: res.id, ...this.marqueForm }];
        }
        this.cancelMarque();
      },
      error: (err: any) => alert(err.error?.message || 'Erreur')
    });
  }

  editMarque(m: any): void {
    this.editingMarque = m;
    this.marqueForm = {
      nom: m.nom, pays: m.pays ?? '', continent: m.continent ?? '',
      date_creation: m.date_creation ?? '', description: m.description ?? '',
      createur: m.createur ?? ''
    };
    this.showAddMarque = true;
  }

  cancelMarque(): void {
    this.editingMarque = null;
    this.marqueForm = { nom: '', pays: '', continent: '', date_creation: '', description: '', createur: '' };
    this.showAddMarque = false;
  }

  removeMarque(id: number): void {
    if (!confirm('Supprimer cette marque ?')) return;
    this.adminService.deleteMarque(id).subscribe({
      next: () => { this.marques = this.marques.filter(m => Number(m.id_marque) !== id); },
      error: (err: any) => alert(err.error?.message || 'Erreur')
    });
  }

  // Types
  saveType(): void {
    if (!this.typeForm.nom.trim()) return;
    const obs = this.editingType
      ? this.adminService.updateType(this.editingType.id_type, this.typeForm)
      : this.adminService.createType(this.typeForm);
    obs.subscribe({
      next: (res: any) => {
        if (this.editingType) {
          Object.assign(this.editingType, this.typeForm);
        } else {
          this.types = [...this.types, { id_type: res.id, ...this.typeForm }];
        }
        this.cancelType();
      },
      error: (err: any) => alert(err.error?.message || 'Erreur')
    });
  }

  editType(t: any): void {
    this.editingType = t;
    this.typeForm = { nom: t.nom };
    this.showAddType = true;
  }

  cancelType(): void {
    this.editingType = null;
    this.typeForm = { nom: '' };
    this.showAddType = false;
  }

  removeType(id: number): void {
    if (!confirm('Supprimer ce type ?')) return;
    this.adminService.deleteType(id).subscribe({
      next: () => { this.types = this.types.filter(t => Number(t.id_type) !== id); },
      error: (err: any) => alert(err.error?.message || 'Erreur')
    });
  }

  // Modèles
  saveModele(): void {
    if (!this.modeleForm.nom.trim() || !this.modeleForm.id_marque) return;
    const obs = this.editingModele
      ? this.adminService.updateModele(this.editingModele.id_modele, this.modeleForm)
      : this.adminService.createModele(this.modeleForm);
    obs.subscribe({
      next: (res: any) => {
        const marque = this.marques.find((m: any) => Number(m.id_marque) === Number(this.modeleForm.id_marque));
        const type   = this.types.find((t: any)   => Number(t.id_type)   === Number(this.modeleForm.id_type));
        const entry = {
          id_modele: this.editingModele?.id_modele ?? res.id,
          ...this.modeleForm,
          marque_nom: marque?.nom ?? '',
          type_nom:   type?.nom   ?? ''
        };
        if (this.editingModele) {
          Object.assign(this.editingModele, entry);
        } else {
          this.modeles = [...this.modeles, entry];
        }
        this.cancelModele();
      },
      error: (err: any) => alert(err.error?.message || 'Erreur')
    });
  }

  editModele(m: any): void {
    this.editingModele = m;
    this.modeleForm = { nom: m.nom, id_marque: m.id_marque, id_type: m.id_type ?? '', annee_creation: m.annee_creation ?? '' };
    this.showAddModele = true;
  }

  cancelModele(): void {
    this.editingModele = null;
    this.modeleForm = { nom: '', id_marque: '', id_type: '', annee_creation: '' };
    this.showAddModele = false;
  }

  removeModele(id: number): void {
    if (!confirm('Supprimer ce modèle ?')) return;
    this.adminService.deleteModele(id).subscribe({
      next: () => { this.modeles = this.modeles.filter(m => Number(m.id_modele) !== id); },
      error: (err: any) => alert(err.error?.message || 'Erreur')
    });
  }

  // Générations
  saveGeneration(): void {
    if (!this.generationForm.nom.trim() || !this.generationForm.id_modele) return;
    const obs = this.editingGeneration
      ? this.adminService.updateGeneration(this.editingGeneration.id_generation, this.generationForm)
      : this.adminService.createGeneration(this.generationForm);
    obs.subscribe({
      next: (res: any) => {
        const modele = this.modeles.find((m: any) => Number(m.id_modele) === Number(this.generationForm.id_modele));
        const entry = {
          id_generation: this.editingGeneration?.id_generation ?? res.id,
          ...this.generationForm,
          modele_nom: modele?.nom ?? '',
          marque_nom: modele?.marque_nom ?? ''
        };
        if (this.editingGeneration) {
          Object.assign(this.editingGeneration, entry);
        } else {
          this.generations = [...this.generations, entry];
        }
        this.cancelGeneration();
      },
      error: (err: any) => alert(err.error?.message || 'Erreur')
    });
  }

  editGeneration(g: any): void {
    this.editingGeneration = g;
    // Extraire l'année depuis la date MySQL (YYYY-MM-DD → YYYY)
    const annee = g.date_sortie ? String(g.date_sortie).substring(0, 4) : '';
    this.generationForm = { nom: g.nom, id_modele: g.id_modele, date_sortie: annee };
    this.showAddGeneration = true;
  }

  cancelGeneration(): void {
    this.editingGeneration = null;
    this.generationForm = { nom: '', id_modele: '', date_sortie: '' };
    this.showAddGeneration = false;
  }

  removeGeneration(id: number): void {
    if (!confirm('Supprimer cette génération ?')) return;
    this.adminService.deleteGeneration(id).subscribe({
      next: () => { this.generations = this.generations.filter(g => Number(g.id_generation) !== id); },
      error: (err: any) => alert(err.error?.message || 'Erreur')
    });
  }

  // ── CRUD générique ────────────────────────────────────────────────────────

  private crudSave(
    form: any, editing: any,
    createFn: (d: any) => any, updateFn: (id: number, d: any) => any,
    list: any[], idKey: string, extraFields: any,
    onDone: () => void
  ): void {
    const obs = editing
      ? updateFn(Number(editing[idKey]), form)
      : createFn(form);
    obs.subscribe({
      next: (res: any) => {
        if (editing) { Object.assign(editing, form, extraFields); }
        else { list.push({ [idKey]: res.id, ...form, ...extraFields }); }
        onDone();
      },
      error: (err: any) => alert(err.error?.message || 'Erreur')
    });
  }

  private crudDelete(id: number, deleteFn: (id: number) => any, list: any[], idKey: string): void {
    if (!confirm('Confirmer la suppression ?')) return;
    deleteFn(id).subscribe({
      next: () => { const idx = list.findIndex((x: any) => Number(x[idKey]) === id); if (idx >= 0) list.splice(idx, 1); },
      error: (err: any) => alert(err.error?.message || 'Erreur')
    });
  }

  // ── Réservoirs ────────────────────────────────────────────────────────────

  saveReservoir(): void {
    const extra = { marque_nom: this.marques.find((m: any) => Number(m.id_marque) === Number(this.reservoirForm.id_marque))?.nom ?? '' };
    this.crudSave(this.reservoirForm, this.editingReservoir,
      d => this.adminService.createReservoir(d), (id, d) => this.adminService.updateReservoir(id, d),
      this.reservoirs, 'id_reservoir', extra, () => this.cancelReservoir());
  }

  editReservoir(r: any): void {
    this.editingReservoir = r;
    this.reservoirForm = { volume: r.volume ?? '', type: r.type ?? '', id_marque: r.id_marque ?? '' };
    this.showAddReservoir = true;
  }

  cancelReservoir(): void { this.editingReservoir = null; this.reservoirForm = { volume: '', type: '', id_marque: '' }; this.showAddReservoir = false; }
  removeReservoir(id: number): void { this.crudDelete(id, id => this.adminService.deleteReservoir(id), this.reservoirs, 'id_reservoir'); }

  // ── Moteurs ───────────────────────────────────────────────────────────────

  saveMoteur(): void {
    const extra = { marque_nom: this.marques.find((m: any) => Number(m.id_marque) === Number(this.moteurForm.id_marque))?.nom ?? '' };
    this.crudSave(this.moteurForm, this.editingMoteur,
      d => this.adminService.createMoteur(d), (id, d) => this.adminService.updateMoteur(id, d),
      this.moteurs, 'id_moteur', extra, () => this.cancelMoteur());
  }

  editMoteur(m: any): void {
    this.editingMoteur = m;
    this.moteurForm = { nom: m.nom, puissance_DIN: m.puissance_DIN ?? '', puissance_fiscale: m.puissance_fiscale ?? '', cylindree: m.cylindree ?? '', couple_cumul: m.couple_cumul ?? '', nombre_cylindre: m.nombre_cylindre ?? '', nombre_soupapes_cyclindre: m.nombre_soupapes_cyclindre ?? '', alimentation: m.alimentation ?? '', type_suralimentation: m.type_suralimentation ?? '', id_marque: m.id_marque ?? '' };
    this.showAddMoteur = true;
  }

  cancelMoteur(): void { this.editingMoteur = null; this.moteurForm = { nom: '', puissance_DIN: '', puissance_fiscale: '', cylindree: '', couple_cumul: '', nombre_cylindre: '', nombre_soupapes_cyclindre: '', alimentation: '', type_suralimentation: '', id_marque: '' }; this.showAddMoteur = false; }
  removeMoteur(id: number): void { this.crudDelete(id, id => this.adminService.deleteMoteur(id), this.moteurs, 'id_moteur'); }

  // ── Coffres ───────────────────────────────────────────────────────────────

  saveCoffre(): void {
    this.crudSave(this.coffreForm, this.editingCoffre,
      d => this.adminService.createCoffre(d), (id, d) => this.adminService.updateCoffre(id, d),
      this.coffres, 'id_coffre', {}, () => this.cancelCoffre());
  }

  editCoffre(c: any): void { this.editingCoffre = c; this.coffreForm = { volume: c.volume ?? '' }; this.showAddCoffre = true; }
  cancelCoffre(): void { this.editingCoffre = null; this.coffreForm = { volume: '' }; this.showAddCoffre = false; }
  removeCoffre(id: number): void { this.crudDelete(id, id => this.adminService.deleteCoffre(id), this.coffres, 'id_coffre'); }

  // ── Versions ──────────────────────────────────────────────────────────────

  saveVersion(): void {
    const gen = this.generations.find((g: any) => Number(g.id_generation) === Number(this.versionForm.id_generation));
    const extra = { generation_nom: gen?.nom ?? '', modele_nom: gen?.modele_nom ?? '', marque_nom: gen?.marque_nom ?? '' };
    this.crudSave(this.versionForm, this.editingVersion,
      d => this.adminService.createVersion(d), (id, d) => this.adminService.updateVersion(id, d),
      this.versions, 'id_version', extra, () => this.cancelVersion());
  }

  editVersion(v: any): void {
    this.editingVersion = v;
    this.versionForm = { nom: v.nom, id_generation: v.id_generation, id_reservoir: v.id_reservoir ?? '', id_coffre: v.id_coffre ?? '', transmission: v.transmission ?? '', boite_vitesse: v.boite_vitesse ?? '', nombre_rapport: v.nombre_rapport ?? '', nombre_places: v.nombre_places ?? '', nombre_portes: v.nombre_portes ?? '', vitesse_max: v.vitesse_max ?? '', consomation_mixte: v.consomation_mixte ?? '', emission_CO2: v.emission_CO2 ?? '', Norme_euro: v.Norme_euro ?? '', Crit_air: v.Crit_air ?? '', hauteur: v.hauteur ?? '', empattement: v.empattement ?? '', poids_vide: v.poids_vide ?? '', suspension_avant: v.suspension_avant ?? '', suspension_arriere: v.suspension_arriere ?? '', freins_avant: v.freins_avant ?? '', freins_arriere: v.freins_arriere ?? '' };
    this.showAddVersion = true;
  }

  cancelVersion(): void {
    this.editingVersion = null;
    this.versionForm = { nom: '', id_generation: '', id_reservoir: '', id_coffre: '', transmission: '', boite_vitesse: '', nombre_rapport: '', nombre_places: '', nombre_portes: '', vitesse_max: '', consomation_mixte: '', emission_CO2: '', Norme_euro: '', Crit_air: '', hauteur: '', empattement: '', poids_vide: '', suspension_avant: '', suspension_arriere: '', freins_avant: '', freins_arriere: '' };
    this.showAddVersion = false;
  }

  removeVersion(id: number): void { this.crudDelete(id, id => this.adminService.deleteVersion(id), this.versions, 'id_version'); }

  expandVersion(v: any): void {
    if (this.expandedVersion?.id_version === v.id_version) { this.expandedVersion = null; this.versionMoteurs = []; return; }
    this.expandedVersion = v;
    this.adminService.getVersionMoteurs(Number(v.id_version)).subscribe({
      next: (m: any[]) => { this.versionMoteurs = m; },
      error: () => {}
    });
  }

  addMoteurToVersion(): void {
    if (!this.addMoteurId || !this.expandedVersion) return;
    this.adminService.addMoteurVersion(Number(this.expandedVersion.id_version), Number(this.addMoteurId)).subscribe({
      next: () => {
        const m = this.moteurs.find((x: any) => Number(x.id_moteur) === Number(this.addMoteurId));
        if (m && !this.versionMoteurs.find((x: any) => Number(x.id_moteur) === Number(this.addMoteurId))) {
          this.versionMoteurs = [...this.versionMoteurs, m];
        }
        this.addMoteurId = '';
      },
      error: (err: any) => alert(err.error?.message || 'Erreur')
    });
  }

  removeMoteurFromVersion(moteurId: number): void {
    this.adminService.removeMoteurVersion(Number(this.expandedVersion.id_version), moteurId).subscribe({
      next: () => { this.versionMoteurs = this.versionMoteurs.filter((m: any) => Number(m.id_moteur) !== moteurId); },
      error: (err: any) => alert(err.error?.message || 'Erreur')
    });
  }

  generationsByModele(idModele: any): any[] {
    return this.generations.filter((g: any) => Number(g.id_modele) === Number(idModele));
  }

  modelesByMarque(idMarque: any): any[] {
    return this.modeles.filter((m: any) => Number(m.id_marque) === Number(idMarque));
  }

  onCatOnglet(tab: 'marques' | 'types' | 'modeles' | 'generations' | 'reservoirs' | 'moteurs' | 'coffres' | 'versions'): void {
    this.catOnglet = tab;
    if (!this.marques.length && !this.catLoading) this.loadCatalogue();
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
