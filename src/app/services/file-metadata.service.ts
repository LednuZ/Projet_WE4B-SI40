import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FileMetadata {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  annonceId: number | null;
  userId: number | null;
  userEmail: string | null;
  uploadedAt: string;
}

export interface FileStats {
  total: number;
  byType: { _id: string; count: number; totalSize: number }[];
}

@Injectable({ providedIn: 'root' })
export class FileMetadataService {

  private fileUrl = environment.fileApiUrl;

  constructor(private http: HttpClient) {}

  save(file: File, url: string, annonceId: number): void {
    if (!url) return;
    const stored = localStorage.getItem('currentUser');
    const user   = stored ? JSON.parse(stored) : null;
    const payload = {
      filename:     url.split('/').pop(),
      originalName: file.name,
      mimeType:     file.type || 'application/octet-stream',
      size:         file.size,
      url,
      annonceId,
      userId:    user?.id_utilisateur ?? null,
      userEmail: user?.email          ?? null
    };
    this.http.post(this.fileUrl, payload).subscribe({ error: () => {} });
  }

  getFiles(filters: { annonceId?: number; userId?: number; limit?: number; skip?: number } = {}): Observable<{ files: FileMetadata[]; total: number }> {
    let params = new HttpParams();
    if (filters.annonceId != null) params = params.set('annonceId', filters.annonceId.toString());
    if (filters.userId    != null) params = params.set('userId',    filters.userId.toString());
    params = params.set('limit', (filters.limit ?? 50).toString());
    params = params.set('skip',  (filters.skip  ?? 0).toString());
    return this.http.get<{ files: FileMetadata[]; total: number }>(this.fileUrl, { params });
  }

  getStats(): Observable<FileStats> {
    return this.http.get<FileStats>(`${this.fileUrl}/stats`);
  }
}
