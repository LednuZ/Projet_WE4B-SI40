import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type LogAction =
  | 'LOGIN' | 'LOGOUT' | 'REGISTER'
  | 'VIEW_ANNONCE' | 'CREATE_ANNONCE' | 'UPDATE_ANNONCE' | 'DELETE_ANNONCE'
  | 'PAUSE_ANNONCE' | 'RESUME_ANNONCE' | 'SOLD_ANNONCE' | 'UPLOAD_PHOTO'
  | 'ADD_FAVORI' | 'REMOVE_FAVORI'
  | 'SEND_MESSAGE';

export interface LogEntry {
  _id: string;
  action: LogAction;
  userId: number | null;
  userEmail: string | null;
  details: Record<string, any>;
  ip: string | null;
  timestamp: string;
}

export interface LogStats {
  total: number;
  byAction: { _id: string; count: number }[];
}

@Injectable({ providedIn: 'root' })
export class LogService {

  private logUrl = environment.logApiUrl;

  constructor(private http: HttpClient) {}

  log(action: LogAction, details: Record<string, any> = {}): void {
    const stored = localStorage.getItem('currentUser');
    const user = stored ? JSON.parse(stored) : null;
    const payload = {
      action,
      userId:    user?.id_utilisateur ?? null,
      userEmail: user?.email          ?? null,
      details
    };
    this.http.post(this.logUrl, payload).subscribe({ error: () => {} });
  }

  getLogs(filters: { action?: string; userId?: number; limit?: number; skip?: number } = {}): Observable<{ logs: LogEntry[]; total: number }> {
    let params = new HttpParams();
    if (filters.action)         params = params.set('action', filters.action);
    if (filters.userId != null) params = params.set('userId', filters.userId.toString());
    params = params.set('limit', (filters.limit ?? 50).toString());
    params = params.set('skip',  (filters.skip  ?? 0).toString());
    return this.http.get<{ logs: LogEntry[]; total: number }>(this.logUrl, { params });
  }

  getStats(): Observable<LogStats> {
    return this.http.get<LogStats>(`${this.logUrl}/stats`);
  }
}
