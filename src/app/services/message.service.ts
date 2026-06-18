import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getConversations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/messages`);
  }

  getNonLus(): Observable<number> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/messages/non-lus`).pipe(
      map(r => r.count)
    );
  }

  getMessages(annonceId: number, userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/messages/${annonceId}/${userId}`);
  }

  sendMessage(data: { contenu: string; id_annonce: number; id_destinataire: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/messages`, data);
  }

  markAsRead(annonceId: number, userId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/messages/${annonceId}/${userId}/lire`, {});
  }
}
