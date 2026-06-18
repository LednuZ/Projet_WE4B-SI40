import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvisService {

  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getMesAvis(): Observable<{ vendeurs: any[]; modeles: any[] }> {
    return this.http.get<{ vendeurs: any[]; modeles: any[] }>(`${this.apiUrl}/avis/mes-avis`);
  }

  getAvisVendeur(vendeurId: number): Observable<{ avis: any[]; stats: any }> {
    return this.http.get<{ avis: any[]; stats: any }>(`${this.apiUrl}/avis/vendeur/${vendeurId}`);
  }

  postAvisVendeur(data: { id_vendeur: number; note: number; contenu?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/avis/vendeur`, data);
  }

  deleteAvisVendeur(avisId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/avis/vendeur/${avisId}`);
  }

  getAvisModele(modeleId: number): Observable<{ avis: any[]; stats: any }> {
    return this.http.get<{ avis: any[]; stats: any }>(`${this.apiUrl}/avis/modele/${modeleId}`);
  }

  postAvisModele(data: { id_modele: number; note: number; contenu?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/avis/modele`, data);
  }

  deleteAvisModele(avisId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/avis/modele/${avisId}`);
  }
}
