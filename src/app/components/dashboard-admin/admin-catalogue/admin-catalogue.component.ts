import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-catalogue',
  templateUrl: './admin-catalogue.component.html',
  styleUrls: ['../dashboard-admin.component.css']
})
export class AdminCatalogueComponent implements OnInit {

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

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadCatalogue();
  }

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
      error: () => { this.catLoading = false; this.catError = 'Erreur de chargement du catalogue'; }
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

  // Marques
  saveMarque(): void {
    if (!this.marqueForm.nom.trim()) return;
    this.crudSave(
      this.marqueForm, this.editingMarque,
      d => this.adminService.createMarque(d),
      (id, d) => this.adminService.updateMarque(id, d),
      this.marques, 'id_marque', {},
      () => this.cancelMarque()
    );
  }

  editMarque(m: any): void {
    this.editingMarque = m;
    this.marqueForm = {
      nom: m.nom, pays: m.pays ?? '', continent: m.continent ?? '',
      date_creation: m.date_creation ?? '', description: m.description ?? '', createur: m.createur ?? ''
    };
    this.showAddMarque = true;
  }

  cancelMarque(): void {
    this.editingMarque = null;
    this.marqueForm = { nom: '', pays: '', continent: '', date_creation: '', description: '', createur: '' };
    this.showAddMarque = false;
  }

  removeMarque(id: number): void {
    this.crudDelete(id, id => this.adminService.deleteMarque(id), this.marques, 'id_marque');
  }

  // Types
  saveType(): void {
    if (!this.typeForm.nom.trim()) return;
    this.crudSave(
      this.typeForm, this.editingType,
      d => this.adminService.createType(d),
      (id, d) => this.adminService.updateType(id, d),
      this.types, 'id_type', {},
      () => this.cancelType()
    );
  }

  editType(t: any): void {
    this.editingType = t;
    this.typeForm = { nom: t.nom };
    this.showAddType = true;
  }

  cancelType(): void { this.editingType = null; this.typeForm = { nom: '' }; this.showAddType = false; }
  removeType(id: number): void { this.crudDelete(id, id => this.adminService.deleteType(id), this.types, 'id_type'); }

  // Modèles
  saveModele(): void {
    if (!this.modeleForm.nom.trim() || !this.modeleForm.id_marque) return;
    const marque = this.marques.find((m: any) => Number(m.id_marque) === Number(this.modeleForm.id_marque));
    const type = this.types.find((t: any) => Number(t.id_type) === Number(this.modeleForm.id_type));
    const extra = { marque_nom: marque?.nom ?? '', type_nom: type?.nom ?? '' };
    this.crudSave(
      this.modeleForm, this.editingModele,
      d => this.adminService.createModele(d),
      (id, d) => this.adminService.updateModele(id, d),
      this.modeles, 'id_modele', extra,
      () => this.cancelModele()
    );
  }

  editModele(m: any): void {
    this.editingModele = m;
    this.modeleForm = { nom: m.nom, id_marque: m.id_marque, id_type: m.id_type ?? '', annee_creation: m.annee_creation ?? '' };
    this.showAddModele = true;
  }

  cancelModele(): void { this.editingModele = null; this.modeleForm = { nom: '', id_marque: '', id_type: '', annee_creation: '' }; this.showAddModele = false; }
  removeModele(id: number): void { this.crudDelete(id, id => this.adminService.deleteModele(id), this.modeles, 'id_modele'); }

  // Générations
  saveGeneration(): void {
    if (!this.generationForm.nom.trim() || !this.generationForm.id_modele) return;
    const modele = this.modeles.find((m: any) => Number(m.id_modele) === Number(this.generationForm.id_modele));
    const extra = { modele_nom: modele?.nom ?? '', marque_nom: modele?.marque_nom ?? '' };
    this.crudSave(
      this.generationForm, this.editingGeneration,
      d => this.adminService.createGeneration(d),
      (id, d) => this.adminService.updateGeneration(id, d),
      this.generations, 'id_generation', extra,
      () => this.cancelGeneration()
    );
  }

  editGeneration(g: any): void {
    this.editingGeneration = g;
    this.generationForm = { nom: g.nom, id_modele: g.id_modele, date_sortie: g.date_sortie ? new Date(g.date_sortie).getFullYear() : '' };
    this.showAddGeneration = true;
  }

  cancelGeneration(): void { this.editingGeneration = null; this.generationForm = { nom: '', id_modele: '', date_sortie: '' }; this.showAddGeneration = false; }
  removeGeneration(id: number): void { this.crudDelete(id, id => this.adminService.deleteGeneration(id), this.generations, 'id_generation'); }

  // Réservoirs
  saveReservoir(): void {
    if (!this.reservoirForm.volume || !this.reservoirForm.type) return;
    const extra = { marque_nom: this.marques.find((m: any) => Number(m.id_marque) === Number(this.reservoirForm.id_marque))?.nom ?? '' };
    this.crudSave(
      this.reservoirForm, this.editingReservoir,
      d => this.adminService.createReservoir(d),
      (id, d) => this.adminService.updateReservoir(id, d),
      this.reservoirs, 'id_reservoir', extra,
      () => this.cancelReservoir()
    );
  }

  editReservoir(r: any): void {
    this.editingReservoir = r;
    this.reservoirForm = { volume: r.volume ?? '', type: r.type ?? '', id_marque: r.id_marque ?? '' };
    this.showAddReservoir = true;
  }

  cancelReservoir(): void { this.editingReservoir = null; this.reservoirForm = { volume: '', type: '', id_marque: '' }; this.showAddReservoir = false; }
  removeReservoir(id: number): void { this.crudDelete(id, id => this.adminService.deleteReservoir(id), this.reservoirs, 'id_reservoir'); }

  // Moteurs
  saveMoteur(): void {
    if (!this.moteurForm.nom.trim()) return;
    const extra = { marque_nom: this.marques.find((m: any) => Number(m.id_marque) === Number(this.moteurForm.id_marque))?.nom ?? '' };
    this.crudSave(
      this.moteurForm, this.editingMoteur,
      d => this.adminService.createMoteur(d),
      (id, d) => this.adminService.updateMoteur(id, d),
      this.moteurs, 'id_moteur', extra,
      () => this.cancelMoteur()
    );
  }

  editMoteur(m: any): void {
    this.editingMoteur = m;
    this.moteurForm = { nom: m.nom, puissance_DIN: m.puissance_DIN ?? '', puissance_fiscale: m.puissance_fiscale ?? '', cylindree: m.cylindree ?? '', couple_cumul: m.couple_cumul ?? '', nombre_cylindre: m.nombre_cylindre ?? '', nombre_soupapes_cyclindre: m.nombre_soupapes_cyclindre ?? '', alimentation: m.alimentation ?? '', type_suralimentation: m.type_suralimentation ?? '', id_marque: m.id_marque ?? '' };
    this.showAddMoteur = true;
  }

  cancelMoteur(): void { this.editingMoteur = null; this.moteurForm = { nom: '', puissance_DIN: '', puissance_fiscale: '', cylindree: '', couple_cumul: '', nombre_cylindre: '', nombre_soupapes_cyclindre: '', alimentation: '', type_suralimentation: '', id_marque: '' }; this.showAddMoteur = false; }
  removeMoteur(id: number): void { this.crudDelete(id, id => this.adminService.deleteMoteur(id), this.moteurs, 'id_moteur'); }

  // Coffres
  saveCoffre(): void {
    if (!this.coffreForm.volume) return;
    this.crudSave(
      this.coffreForm, this.editingCoffre,
      d => this.adminService.createCoffre(d),
      (id, d) => this.adminService.updateCoffre(id, d),
      this.coffres, 'id_coffre', {},
      () => this.cancelCoffre()
    );
  }

  editCoffre(c: any): void {
    this.editingCoffre = c;
    this.coffreForm = { volume: c.volume ?? '' };
    this.showAddCoffre = true;
  }

  cancelCoffre(): void { this.editingCoffre = null; this.coffreForm = { volume: '' }; this.showAddCoffre = false; }
  removeCoffre(id: number): void { this.crudDelete(id, id => this.adminService.deleteCoffre(id), this.coffres, 'id_coffre'); }

  // Versions
  saveVersion(): void {
    if (!this.versionForm.nom.trim() || !this.versionForm.id_generation) return;
    const gen = this.generations.find((g: any) => Number(g.id_generation) === Number(this.versionForm.id_generation));
    const extra = { generation_nom: gen?.nom ?? '', modele_nom: gen?.modele_nom ?? '', marque_nom: gen?.marque_nom ?? '' };
    this.crudSave(
      this.versionForm, this.editingVersion,
      d => this.adminService.createVersion(d),
      (id, d) => this.adminService.updateVersion(id, d),
      this.versions, 'id_version', extra,
      () => this.cancelVersion()
    );
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
}
