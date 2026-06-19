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

  // ── Catalogue ──────────────────────────────────────────────────────────────

  private cat = `${this.apiUrl}/catalogue`;

  getMarques(): Observable<any[]>  { return this.http.get<any[]>(`${this.cat}/marques`); }
  createMarque(d: any): Observable<any> { return this.http.post<any>(`${this.cat}/marques`, d); }
  updateMarque(id: number, d: any): Observable<any> { return this.http.put<any>(`${this.cat}/marques/${id}`, d); }
  deleteMarque(id: number): Observable<any> { return this.http.delete<any>(`${this.cat}/marques/${id}`); }

  getTypes(): Observable<any[]>  { return this.http.get<any[]>(`${this.cat}/types`); }
  createType(d: any): Observable<any> { return this.http.post<any>(`${this.cat}/types`, d); }
  updateType(id: number, d: any): Observable<any> { return this.http.put<any>(`${this.cat}/types/${id}`, d); }
  deleteType(id: number): Observable<any> { return this.http.delete<any>(`${this.cat}/types/${id}`); }

  getModeles(): Observable<any[]>  { return this.http.get<any[]>(`${this.cat}/modeles`); }
  createModele(d: any): Observable<any> { return this.http.post<any>(`${this.cat}/modeles`, d); }
  updateModele(id: number, d: any): Observable<any> { return this.http.put<any>(`${this.cat}/modeles/${id}`, d); }
  deleteModele(id: number): Observable<any> { return this.http.delete<any>(`${this.cat}/modeles/${id}`); }

  getGenerations(): Observable<any[]>  { return this.http.get<any[]>(`${this.cat}/generations`); }
  createGeneration(d: any): Observable<any> { return this.http.post<any>(`${this.cat}/generations`, d); }
  updateGeneration(id: number, d: any): Observable<any> { return this.http.put<any>(`${this.cat}/generations/${id}`, d); }
  deleteGeneration(id: number): Observable<any> { return this.http.delete<any>(`${this.cat}/generations/${id}`); }

  getReservoirs(): Observable<any[]> { return this.http.get<any[]>(`${this.cat}/reservoirs`); }
  createReservoir(d: any): Observable<any> { return this.http.post<any>(`${this.cat}/reservoirs`, d); }
  updateReservoir(id: number, d: any): Observable<any> { return this.http.put<any>(`${this.cat}/reservoirs/${id}`, d); }
  deleteReservoir(id: number): Observable<any> { return this.http.delete<any>(`${this.cat}/reservoirs/${id}`); }

  getMoteurs(): Observable<any[]> { return this.http.get<any[]>(`${this.cat}/moteurs`); }
  createMoteur(d: any): Observable<any> { return this.http.post<any>(`${this.cat}/moteurs`, d); }
  updateMoteur(id: number, d: any): Observable<any> { return this.http.put<any>(`${this.cat}/moteurs/${id}`, d); }
  deleteMoteur(id: number): Observable<any> { return this.http.delete<any>(`${this.cat}/moteurs/${id}`); }

  getCoffres(): Observable<any[]> { return this.http.get<any[]>(`${this.cat}/coffres`); }
  createCoffre(d: any): Observable<any> { return this.http.post<any>(`${this.cat}/coffres`, d); }
  updateCoffre(id: number, d: any): Observable<any> { return this.http.put<any>(`${this.cat}/coffres/${id}`, d); }
  deleteCoffre(id: number): Observable<any> { return this.http.delete<any>(`${this.cat}/coffres/${id}`); }

  getVersions(): Observable<any[]> { return this.http.get<any[]>(`${this.cat}/versions`); }
  createVersion(d: any): Observable<any> { return this.http.post<any>(`${this.cat}/versions`, d); }
  updateVersion(id: number, d: any): Observable<any> { return this.http.put<any>(`${this.cat}/versions/${id}`, d); }
  deleteVersion(id: number): Observable<any> { return this.http.delete<any>(`${this.cat}/versions/${id}`); }

  getVersionMoteurs(vId: number): Observable<any[]> { return this.http.get<any[]>(`${this.cat}/versions/${vId}/moteurs`); }
  addMoteurVersion(vId: number, mId: number): Observable<any> { return this.http.post<any>(`${this.cat}/versions/${vId}/moteurs/${mId}`, {}); }
  removeMoteurVersion(vId: number, mId: number): Observable<any> { return this.http.delete<any>(`${this.cat}/versions/${vId}/moteurs/${mId}`); }
}
