import { Component, OnInit } from '@angular/core';
import { LogService, LogEntry, LogAction } from '../../../services/log.service';

@Component({
  selector: 'app-admin-logs',
  templateUrl: './admin-logs.component.html',
  styleUrls: ['../dashboard-admin.component.css']
})
export class AdminLogsComponent implements OnInit {

  logs: LogEntry[] = [];
  logsTotal = 0;
  logsPage = 1;
  readonly logsPageSize = 20;
  logsLoading = false;
  selectedAction = '';
  statsTotal = 0;
  statsByAction: { _id: string; count: number }[] = [];

  readonly allActions: LogAction[] = [
    'LOGIN', 'LOGOUT', 'REGISTER',
    'VIEW_ANNONCE', 'CREATE_ANNONCE', 'UPDATE_ANNONCE', 'DELETE_ANNONCE',
    'PAUSE_ANNONCE', 'RESUME_ANNONCE', 'SOLD_ANNONCE', 'UPLOAD_PHOTO',
    'ADD_FAVORI', 'REMOVE_FAVORI', 'SEND_MESSAGE'
  ];

  readonly keyStats = [
    { label: 'Connexions',          action: 'LOGIN' },
    { label: 'Inscriptions',        action: 'REGISTER' },
    { label: 'Annonces créées',     action: 'CREATE_ANNONCE' },
    { label: 'Annonces supprimées', action: 'DELETE_ANNONCE' },
    { label: 'Photos uploadées',    action: 'UPLOAD_PHOTO' },
    { label: 'Messages envoyés',    action: 'SEND_MESSAGE' },
  ];

  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.loadLogStats();
    this.loadLogs();
  }

  loadLogStats(): void {
    this.logService.getStats().subscribe({
      next: data => { this.statsTotal = data.total; this.statsByAction = data.byAction; },
      error: () => {}
    });
  }

  loadLogs(): void {
    this.logsLoading = true;
    this.logService.getLogs({
      action: this.selectedAction || undefined,
      limit:  this.logsPageSize,
      skip:   (this.logsPage - 1) * this.logsPageSize
    }).subscribe({
      next: data => { this.logs = data.logs; this.logsTotal = data.total; this.logsLoading = false; },
      error: () => { this.logsLoading = false; }
    });
  }

  onFilterChange(): void { this.logsPage = 1; this.loadLogs(); }
  resetFilter(): void { this.selectedAction = ''; this.onFilterChange(); }

  get logsTotalPages(): number { return Math.ceil(this.logsTotal / this.logsPageSize); }
  prevLogsPage(): void { if (this.logsPage > 1) { this.logsPage--; this.loadLogs(); } }
  nextLogsPage(): void { if (this.logsPage < this.logsTotalPages) { this.logsPage++; this.loadLogs(); } }

  getStatCount(action: string): number {
    return this.statsByAction.find(s => s._id === action)?.count ?? 0;
  }

  formatDetails(details: Record<string, any>): string {
    if (!details || Object.keys(details).length === 0) return '—';
    return Object.entries(details).map(([k, v]) => `${k}: ${v}`).join(' | ');
  }
}
