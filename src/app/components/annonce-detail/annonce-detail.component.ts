import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnonceService } from '../../services/annonce.service';
import { AuthService } from '../../services/auth.service';
import { FavoriService } from '../../services/favori.service';
import { AvisService } from '../../services/avis.service';
import { Annonce } from '../../models/annonce.model';

@Component({
  selector: 'app-annonce-detail',
  templateUrl: './annonce-detail.component.html',
  styleUrls: ['./annonce-detail.component.css']
})
export class AnnonceDetailComponent implements OnInit {

  annonce: Annonce | null = null;
  loading = true;
  selectedPhoto = '';
  error = '';
  isFavori = false;
  annoncesSimilaires: Annonce[] = [];
  favorisIds: Set<number> = new Set();

  // Avis vendeur
  avisVendeur: { avis: any[]; stats: any } = { avis: [], stats: null };
  showFormVendeur = false;
  noteVendeur = 0;
  contenuVendeur = '';
  avisVendeurMsg = '';
  avisVendeurError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private annonceService: AnnonceService,
    public authService: AuthService,
    private favoriService: FavoriService,
    private avisService: AvisService
  ) {}

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id');
    const id = Number(idStr);
    if (idStr === null || isNaN(id)) { this.router.navigate(['/']); return; }

    this.annonceService.getAnnonce(id).subscribe({
      next: (data) => {
        this.annonce = data;
        if (data.photos && data.photos.length > 0) {
          this.selectedPhoto = this.getPhotoUrl(data.photos[0].url_photo);
        } else if (data.photo_principale) {
          this.selectedPhoto = this.getPhotoUrl(data.photo_principale);
        }
        this.loading = false;

        if (this.authService.isLoggedIn()) {
          this.favoriService.getFavoris().subscribe({
            next: (favs: any[]) => {
              this.favorisIds = new Set(favs.map((f: any) => Number(f.id_annonce)));
              this.isFavori = this.favorisIds.has(id);
            },
            error: () => {}
          });
        }
        if (data.vendeur_id)  this.loadAvisVendeur(data.vendeur_id);
        if (data.id_marque)   this.loadAnnoncesSimilaires(data.id_marque, data.id_annonce);
      },
      error: () => { this.error = 'Annonce introuvable'; this.loading = false; }
    });
  }

  // ── Favori ────────────────────────────────────────────────────────────────

  toggleFavori(): void {
    if (!this.annonce) return;
    const id = this.annonce.id_annonce;
    if (this.isFavori) {
      this.favoriService.removeFavori(id).subscribe({
        next: () => { 
          this.isFavori = false; 
          this.favorisIds.delete(id);
          this.favorisIds = new Set(this.favorisIds);
        }, 
        error: (err: any) => console.error(err)
      });
    } else {
      this.favoriService.addFavori(id).subscribe({
        next: () => { 
          this.isFavori = true; 
          this.favorisIds.add(id);
          this.favorisIds = new Set(this.favorisIds);
        }, 
        error: (err: any) => console.error(err)
      });
    }
  }

  // ── Avis vendeur ─────────────────────────────────────────────────────────

  loadAvisVendeur(vendeurId: number): void {
    this.avisService.getAvisVendeur(vendeurId).subscribe({
      next: (data: any) => { this.avisVendeur = data; },
      error: () => {}
    });
  }

  submitAvisVendeur(): void {
    if (!this.annonce?.vendeur_id || this.noteVendeur < 1) return;
    this.avisVendeurError = '';
    this.avisService.postAvisVendeur({
      id_vendeur: this.annonce.vendeur_id,
      note: this.noteVendeur,
      contenu: this.contenuVendeur || undefined
    }).subscribe({
      next: () => {
        this.avisVendeurMsg = 'Avis envoyé, merci !';
        this.showFormVendeur = false;
        this.noteVendeur = 0;
        this.contenuVendeur = '';
        this.loadAvisVendeur(this.annonce!.vendeur_id!);
        setTimeout(() => (this.avisVendeurMsg = ''), 4000);
      },
      error: (err: any) => {
        this.avisVendeurError = err.error?.message || 'Erreur lors de l\'envoi';
      }
    });
  }



  isMyAvis(avis: any): boolean {
    return this.authService.getCurrentUser()?.id_utilisateur === avis.redacteur_id;
  }

  isVendeur(): boolean {
    return this.authService.getCurrentUser()?.id_utilisateur === this.annonce?.vendeur_id;
  }

  // ── Utilitaires ───────────────────────────────────────────────────────────

  getPhotoUrl(path: string): string {
    if (!path) return 'assets/no-photo.svg';
    return 'http://localhost:8000' + path;
  }

  selectPhoto(url: string): void { this.selectedPhoto = this.getPhotoUrl(url); }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency', currency: 'EUR', maximumFractionDigits: 0
    }).format(prix);
  }

  formatKm(km: number): string {
    return new Intl.NumberFormat('fr-FR').format(km) + ' km';
  }

  goBack(): void { this.router.navigate(['/annonces']); }

  contacterVendeur(): void {
    if (!this.authService.isLoggedIn()) { this.router.navigate(['/login']); return; }
    this.router.navigate(['/messagerie'], {
      queryParams: { annonce: this.annonce?.id_annonce, destinataire: this.annonce?.vendeur_id }
    });
  }

  // ── Annonces Similaires ───────────────────────────────────────────────────

  loadAnnoncesSimilaires(marqueId: number, currentAnnonceId: number): void {
    this.annonceService.getAnnonces({ marque_id: marqueId }).subscribe({
      next: (res: Annonce[]) => {
        this.annoncesSimilaires = res
          .filter(a => a.id_annonce !== currentAnnonceId)
          .slice(0, 4);
      },
      error: () => {}
    });
  }

  isFavoriSimilar(id: number): boolean {
    return this.favorisIds.has(id);
  }

  toggleFavoriSimilar(annonceId: number): void {
    if (!this.authService.isLoggedIn()) { this.router.navigate(['/login']); return; }

    if (this.favorisIds.has(annonceId)) {
      this.favoriService.removeFavori(annonceId).subscribe({
        next: () => { 
          this.favorisIds.delete(annonceId); 
          this.favorisIds = new Set(this.favorisIds); 
        },
        error: (err: any) => console.error(err)
      });
    } else {
      this.favoriService.addFavori(annonceId).subscribe({
        next: () => { 
          this.favorisIds.add(annonceId); 
          this.favorisIds = new Set(this.favorisIds); 
        },
        error: (err: any) => console.error(err)
      });
    }
  }
}
