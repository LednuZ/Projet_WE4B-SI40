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

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }

  getRoleLabel(role: string): string {
    const map: { [k: string]: string } = {
      admin: 'Administrateur', particulier: 'Particulier', entreprise: 'Professionnel'
    };
    return map[role] || role;
  }
}
