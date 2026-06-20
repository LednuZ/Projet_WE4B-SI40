import { Component, OnInit } from '@angular/core';
import { AvisService } from '../../services/avis.service';

@Component({
  selector: 'app-avis',
  templateUrl: './avis.component.html',
  styleUrls: ['./avis.component.css']
})
export class AvisComponent implements OnInit {

  mesAvisVendeurs: any[] = [];
  loading = true;

  constructor(private avisService: AvisService) {}

  ngOnInit(): void {
    this.avisService.getMesAvis().subscribe({
      next: (data: { vendeurs: any[]; modeles: any[] }) => {
        this.mesAvisVendeurs = data.vendeurs;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  supprimerVendeur(avisId: number): void {
    this.avisService.deleteAvisVendeur(avisId).subscribe({
      next: () => { this.mesAvisVendeurs = this.mesAvisVendeurs.filter(a => a.id_avis_utilisateur !== avisId); },
      error: (err: any) => console.error(err)
    });
  }
}
