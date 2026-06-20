import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnnonceService } from '../../services/annonce.service';
import { AuthService } from '../../services/auth.service';
import { FavoriService } from '../../services/favori.service';
import { Annonce } from '../../models/annonce.model';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {

  annonces: Annonce[] = [];
  marques: any[] = [];
  loading = true;
  showFilters = false;
  favorisIds: Set<number> = new Set();

  filters: any = {
    marque_id: '', 
    prix_min: 0, 
    prix_max: 150000,
    km_max: '', 
    annee_min: 1990, 
    annee_max: 2026,
    carburant: ''
  };
  sort = 'recent';

  constructor(
    private annonceService: AnnonceService,
    public authService: AuthService,
    private favoriService: FavoriService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadMarques();
    
    // Subscribe to query parameters to catch searches from the homepage
    this.route.queryParams.subscribe(params => {
      if (params['marque_id']) {
        this.filters.marque_id = Number(params['marque_id']);
      } else {
        this.filters.marque_id = '';
      }
      this.loadAnnonces();
    });

    if (this.authService.isLoggedIn()) {
      this.favoriService.getFavoris().subscribe({
        next: (favs: any[]) => {
          this.favorisIds = new Set(favs.map((f: any) => Number(f.id_annonce)));
        },
        error: () => {}
      });
    }
  }

  loadMarques(): void {
    this.annonceService.getMarques().subscribe({
      next: (data: any[]) => { this.marques = data; },
      error: (err: any) => console.error(err)
    });
  }

  loadAnnonces(): void {
    this.loading = true;
    this.annonceService.getAnnonces(this.filters, this.sort).subscribe({
      next: (data: Annonce[]) => { this.annonces = data; this.loading = false; },
      error: (err: any) => { console.error(err); this.loading = false; }
    });
  }

  onFilterChange(): void  { this.loadAnnonces(); }
  onSortChange(s: string): void { this.sort = s; this.loadAnnonces(); }

  resetFilters(): void {
    this.filters = {
      marque_id: '',
      prix_min: 0,
      prix_max: 150000,
      km_max: '',
      annee_min: 1990,
      annee_max: 2026,
      carburant: ''
    };
    this.sort = 'recent';
    this.loadAnnonces();
  }

  toggleFilters(): void { this.showFilters = !this.showFilters; }

  isFavori(id: number): boolean { return this.favorisIds.has(id); }

  toggleFavori(annonceId: number): void {
    if (!this.authService.isLoggedIn()) return;

    if (this.favorisIds.has(annonceId)) {
      this.favoriService.removeFavori(annonceId).subscribe({
        next: () => { this.favorisIds.delete(annonceId); this.favorisIds = new Set(this.favorisIds); },
        error: (err: any) => console.error(err)
      });
    } else {
      this.favoriService.addFavori(annonceId).subscribe({
        next: () => { this.favorisIds.add(annonceId); this.favorisIds = new Set(this.favorisIds); },
        error: (err: any) => console.error(err)
      });
    }
  }
}
