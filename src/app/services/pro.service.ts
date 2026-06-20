import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProService {

  private apiUrl = 'http://localhost:8000/api/pro';

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  getAnnonces(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/annonces`);
  }
}
