import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../models/utilisateur.model';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getProfil(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/profil`);
  }

  updateProfil(data: Partial<Utilisateur>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profil`, data);
  }

  updatePassword(data: { ancien_mdp: string; nouveau_mdp: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profil/password`, data);
  }

  deleteCompte(mdp: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/profil`, { body: { mdp } });
  }
}
