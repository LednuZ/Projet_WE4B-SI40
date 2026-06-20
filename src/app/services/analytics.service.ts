import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
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

export interface AnalyticsState {
  indicateurs: Indicateurs | null;
  activite: ActiviteData | null;
  heures: HeuresData | null;
  jours: number;
  loading: boolean;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {

  private base = environment.logApiUrl.replace('/logs', '');

  private stateSubject = new BehaviorSubject<AnalyticsState>({
    indicateurs: null,
    activite: null,
    heures: null,
    jours: 30,
    loading: false
  });

  public state$ = this.stateSubject.asObservable();

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

  updateAnalytics(jours = 30): void {
    const current = this.stateSubject.value;
    this.stateSubject.next({ ...current, loading: true, jours });

    forkJoin([
      this.getIndicateurs(),
      this.getActivite(jours),
      this.getHeures()
    ]).subscribe({
      next: ([indicateurs, activite, heures]) => {
        this.stateSubject.next({
          indicateurs,
          activite,
          heures,
          jours,
          loading: false
        });
      },
      error: () => {
        this.stateSubject.next({
          ...this.stateSubject.value,
          loading: false
        });
      }
    });
  }
}
