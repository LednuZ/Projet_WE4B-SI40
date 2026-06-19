import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {

  private apiUrl = 'http://localhost:8000/api/admin';

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  getUtilisateurs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/utilisateurs`);
  }

  updateRole(userId: number, role: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/utilisateurs/${userId}/role`, { role });
  }

  deleteUtilisateur(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/utilisateurs/${userId}`);
  }

  getAnnonces(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/annonces`);
  }

  updateStatutAnnonce(annonceId: number, statut: string, commentaire?: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/annonces/${annonceId}/statut`, {
      statut,
      commentaire_admin: commentaire ?? null
    });
  }

  deleteAnnonce(annonceId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/annonces/${annonceId}`);
  }

  getAvis(): Observable<{ vendeurs: any[]; modeles: any[] }> {
    return this.http.get<{ vendeurs: any[]; modeles: any[] }>(`${this.apiUrl}/avis`);
  }

  deleteAvisVendeur(avisId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/avis/vendeur/${avisId}`);
  }

  deleteAvisModele(avisId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/avis/modele/${avisId}`);
  }
}
