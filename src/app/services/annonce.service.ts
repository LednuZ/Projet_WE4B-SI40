import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Annonce } from '../models/annonce.model';

@Injectable({
  providedIn: 'root'
})
export class AnnonceService {

  private apiUrl = 'http://localhost:8000/api/annonces';

  constructor(private http: HttpClient) {}

  getAnnonces(filters: any = {}, sort: string = 'recent'): Observable<Annonce[]> {
    let params = new HttpParams().set('sort', sort);

    if (filters.marque_id) params = params.set('marque_id', filters.marque_id);
    if (filters.modele_id) params = params.set('modele_id', filters.modele_id);
    if (filters.prix_min) params = params.set('prix_min', filters.prix_min);
    if (filters.prix_max) params = params.set('prix_max', filters.prix_max);
    if (filters.km_max) params = params.set('km_max', filters.km_max);
    if (filters.annee_min) params = params.set('annee_min', filters.annee_min);
    if (filters.annee_max) params = params.set('annee_max', filters.annee_max);

    return this.http.get<Annonce[]>(this.apiUrl, { params });
  }

  getAnnonce(id: number): Observable<Annonce> {
    return this.http.get<Annonce>(`${this.apiUrl}/${id}`);
  }

  getMarques(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/marques`);
  }

  getCatalogTree(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/catalogue-tree`);
  }

  createAnnonce(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateAnnonce(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteAnnonce(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  
  getMesAnnonces(): Observable<Annonce[]> {
    return this.http.get<Annonce[]>(`${this.apiUrl}/mes-annonces`);
  }

  pauseAnnonce(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/pause`, {});
  }

  reprendreAnnonce(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/reprendre`, {});
  }

  marquerVendu(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/vendu`, {});
  }

  uploadPhoto(annonceId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http.post<any>(`${this.apiUrl}/${annonceId}/photos`, formData);
  }

  supprimerPhoto(photoId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/photos/${photoId}`);
  }
}
