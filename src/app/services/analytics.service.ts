import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ActiviteData {
  dates: string[];
  series: Record<string, number[]>;
}

export interface Indicateurs {
  connexions: number;
  inscriptions: number;
  consultations: number;
  publications: number;
  ventes: number;
  messages: number;
  favorisAjoutes: number;
  photosUploadees: number;
  tauxConversion: string;
  totalFichiers: number;
  totalTaille: number;
}

export interface HeuresData {
  heures: { heure: string; count: number }[];
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {

  private base = environment.logApiUrl.replace('/logs', '');

  constructor(private http: HttpClient) {}

  getActivite(jours = 30): Observable<ActiviteData> {
    const params = new HttpParams().set('jours', jours.toString());
    return this.http.get<ActiviteData>(`${this.base}/analytics/activite`, { params });
  }

  getIndicateurs(): Observable<Indicateurs> {
    return this.http.get<Indicateurs>(`${this.base}/analytics/indicateurs`);
  }

  getHeures(): Observable<HeuresData> {
    return this.http.get<HeuresData>(`${this.base}/analytics/heures`);
  }
}
