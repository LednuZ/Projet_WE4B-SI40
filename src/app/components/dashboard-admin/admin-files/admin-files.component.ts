import { Component, OnInit } from '@angular/core';
import { FileMetadataService, FileMetadata } from '../../../services/file-metadata.service';

@Component({
  selector: 'app-admin-files',
  templateUrl: './admin-files.component.html',
  styleUrls: ['../dashboard-admin.component.css']
})
export class AdminFilesComponent implements OnInit {

  files: FileMetadata[] = [];
  filesTotal = 0;
  filesPage = 1;
  readonly filesPageSize = 20;
  filesLoading = false;
  filesStatsTotal = 0;
  filesByType: { _id: string; count: number; totalSize: number }[] = [];

  constructor(private fileMetaService: FileMetadataService) {}

  ngOnInit(): void {
    this.loadFileStats();
    this.loadFiles();
  }

  loadFileStats(): void {
    this.fileMetaService.getStats().subscribe({
      next: data => { this.filesStatsTotal = data.total; this.filesByType = data.byType; },
      error: () => {}
    });
  }

  loadFiles(): void {
    this.filesLoading = true;
    this.fileMetaService.getFiles({ limit: this.filesPageSize, skip: (this.filesPage - 1) * this.filesPageSize }).subscribe({
      next: data => { this.files = data.files; this.filesTotal = data.total; this.filesLoading = false; },
      error: () => { this.filesLoading = false; }
    });
  }

  get filesTotalPages(): number { return Math.ceil(this.filesTotal / this.filesPageSize); }
  prevFilesPage(): void { if (this.filesPage > 1) { this.filesPage--; this.loadFiles(); } }
  nextFilesPage(): void { if (this.filesPage < this.filesTotalPages) { this.filesPage++; this.loadFiles(); } }

  formatSize(bytes: number): string {
    if (bytes < 1024)        return bytes + ' o';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
  }
}
