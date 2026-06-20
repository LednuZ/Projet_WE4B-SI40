import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavoriService } from '../../services/favori.service';

@Component({
  selector: 'app-favoris',
  templateUrl: './favoris.component.html',
  styleUrls: ['./favoris.component.css']
})
export class FavorisComponent implements OnInit {

  favoris: any[] = [];
  loading = true;

  constructor(
    private favoriService: FavoriService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.favoriService.getFavoris().subscribe({
      next: (data: any[]) => {
        this.favoris = data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  retirer(annonceId: number): void {
    this.favoriService.removeFavori(annonceId).subscribe({
      next: () => {
        this.favoris = this.favoris.filter(f => f.id_annonce !== annonceId);
      },
      error: (err: any) => console.error(err)
    });
  }
}
