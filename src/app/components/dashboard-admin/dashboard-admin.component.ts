import { Component, OnInit } from '@angular/core';
import { LogService, LogEntry, LogAction } from '../../services/log.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  logs: LogEntry[] = [];
  total = 0;
  statsTotal = 0;
  statsByAction: { _id: string; count: number }[] = [];

  selectedAction = '';
  currentPage = 1;
  readonly pageSize = 20;
  loading = false;
  statsLoading = false;

  readonly allActions: LogAction[] = [
    'LOGIN', 'LOGOUT', 'REGISTER',
    'VIEW_ANNONCE', 'CREATE_ANNONCE', 'UPDATE_ANNONCE', 'DELETE_ANNONCE',
    'PAUSE_ANNONCE', 'RESUME_ANNONCE', 'SOLD_ANNONCE', 'UPLOAD_PHOTO',
    'ADD_FAVORI', 'REMOVE_FAVORI', 'SEND_MESSAGE'
  ];

  readonly keyStats = [
    { label: 'Connexions',          action: 'LOGIN',          icon: '🔑', css: 'border-success' },
    { label: 'Inscriptions',        action: 'REGISTER',       icon: '👤', css: 'border-primary' },
    { label: 'Annonces créées',     action: 'CREATE_ANNONCE', icon: '📝', css: 'border-info' },
    { label: 'Annonces supprimées', action: 'DELETE_ANNONCE', icon: '🗑️', css: 'border-danger' },
    { label: 'Ventes',              action: 'SOLD_ANNONCE',   icon: '💰', css: 'border-warning' },
    { label: 'Messages envoyés',    action: 'SEND_MESSAGE',   icon: '✉️', css: 'border-secondary' },
  ];

  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadLogs();
  }

  loadStats(): void {
    this.statsLoading = true;
    this.logService.getStats().subscribe({
      next: data => {
        this.statsTotal   = data.total;
        this.statsByAction = data.byAction;
        this.statsLoading = false;
      },
      error: () => { this.statsLoading = false; }
    });
  }

  loadLogs(): void {
    this.loading = true;
    this.logService.getLogs({
      action: this.selectedAction || undefined,
      limit:  this.pageSize,
      skip:   (this.currentPage - 1) * this.pageSize
    }).subscribe({
      next: data => {
        this.logs    = data.logs;
        this.total   = data.total;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadLogs();
  }

  resetFilter(): void {
    this.selectedAction = '';
    this.onFilterChange();
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadLogs();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadLogs();
    }
  }

  getStatCount(action: string): number {
    return this.statsByAction.find(s => s._id === action)?.count ?? 0;
  }

  getActionBadgeClass(action: string): string {
    const map: Record<string, string> = {
      LOGIN:           'badge bg-success',
      LOGOUT:          'badge bg-secondary',
      REGISTER:        'badge bg-primary',
      CREATE_ANNONCE:  'badge bg-info text-dark',
      UPDATE_ANNONCE:  'badge bg-info text-dark',
      DELETE_ANNONCE:  'badge bg-danger',
      PAUSE_ANNONCE:   'badge bg-warning text-dark',
      RESUME_ANNONCE:  'badge bg-warning text-dark',
      SOLD_ANNONCE:    'badge bg-success',
      UPLOAD_PHOTO:    'badge bg-light text-dark border',
      ADD_FAVORI:      'badge bg-warning text-dark',
      REMOVE_FAVORI:   'badge bg-warning text-dark',
      SEND_MESSAGE:    'badge bg-primary',
      VIEW_ANNONCE:    'badge bg-light text-dark border',
    };
    return map[action] ?? 'badge bg-light text-dark';
  }

  formatDetails(details: Record<string, any>): string {
    if (!details || Object.keys(details).length === 0) return '—';
    return Object.entries(details)
      .map(([k, v]) => `${k}: ${v}`)
      .join(' | ');
  }
}
