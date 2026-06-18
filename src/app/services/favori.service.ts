import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriService {

  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getFavoris(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/favoris`);
  }

  addFavori(annonceId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/favoris/${annonceId}`, {});
  }

  removeFavori(annonceId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/favoris/${annonceId}`);
  }

  checkFavori(annonceId: number): Observable<{ isFavori: boolean }> {
    return this.http.get<{ isFavori: boolean }>(`${this.apiUrl}/favoris/check/${annonceId}`);
  }
}
