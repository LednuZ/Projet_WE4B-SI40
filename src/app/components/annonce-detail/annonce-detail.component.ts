import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnonceService } from '../../services/annonce.service';
import { AuthService } from '../../services/auth.service';
import { Annonce } from '../../models/annonce.model';

@Component({
  selector: 'app-annonce-detail',
  templateUrl: './annonce-detail.component.html',
  styleUrls: ['./annonce-detail.component.css']
})
export class AnnonceDetailComponent implements OnInit {

  annonce: Annonce | null = null;
  loading: boolean = true;
  selectedPhoto: string = '';
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private annonceService: AnnonceService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id');
    const id = Number(idStr);
    if (idStr === null || isNaN(id)) {
      this.router.navigate(['/']);
      return;
    }

    this.annonceService.getAnnonce(id).subscribe({
      next: (data) => {
        this.annonce = data;
        if (data.photos && data.photos.length > 0) {
          this.selectedPhoto = this.getPhotoUrl(data.photos[0].url_photo);
        } else if (data.photo_principale) {
          this.selectedPhoto = this.getPhotoUrl(data.photo_principale);
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Annonce introuvable';
        this.loading = false;
      }
    });
  }

  getPhotoUrl(path: string): string {
    if (!path) return 'assets/no-photo.png';
    return 'http://localhost:8000' + path;
  }

  selectPhoto(url: string): void {
    this.selectedPhoto = this.getPhotoUrl(url);
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

  goBack(): void {
    this.router.navigate(['/']);
  }

  contacterVendeur(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/messagerie'], {
      queryParams: {
        annonce: this.annonce?.id_annonce,
        destinataire: this.annonce?.vendeur_id
      }
    });
  }
}