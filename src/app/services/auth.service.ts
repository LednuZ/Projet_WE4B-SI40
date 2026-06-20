import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Utilisateur } from '../models/utilisateur.model';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api';
  private currentUserSubject = new BehaviorSubject<Utilisateur | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private logService: LogService) {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  login(email: string, mdp: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, mdp }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
        if (response.utilisateur) {
          localStorage.setItem('currentUser', JSON.stringify(response.utilisateur));
          this.currentUserSubject.next(response.utilisateur);
          this.logService.log('LOGIN', { email });
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout(): void {
    this.logService.log('LOGOUT');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getRole(): string | null {
    return this.currentUserSubject.value?.role ?? null;
  }

  getCurrentUser(): Utilisateur | null {
    return this.currentUserSubject.value;
  }
}