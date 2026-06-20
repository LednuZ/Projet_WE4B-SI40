import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AnalyticsState, Indicateurs, ActiviteData, HeuresData } from '../../../services/analytics.service';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-analyses',
  templateUrl: './admin-analyses.component.html',
  styleUrls: ['../dashboard-admin.component.css']
})
export class AdminAnalysesComponent implements OnChanges, OnDestroy {

  @Input() state: AnalyticsState | null = null;
  @Output() changeJours = new EventEmitter<number>();

  @ViewChild('chartActivite')  chartActiviteRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartActions')   chartActionsRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartHeures')    chartHeuresRef!: ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['state'] && this.state && !this.state.loading && this.state.indicateurs) {
      setTimeout(() => {
        this.renderCharts();
      }, 50);
    }
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  onJoursChange(jours: number): void {
    this.changeJours.emit(jours);
  }

  formatSize(bytes: number): string {
    if (bytes < 1024)        return bytes + ' o';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
  }

  private destroyCharts(): void {
    this.charts.forEach(c => c.destroy());
    this.charts = [];
  }

  private renderCharts(): void {
    this.destroyCharts();
    if (!this.state) return;

    if (this.state.activite) {
      this.buildChartActivite(this.state.activite);
    }
    if (this.state.indicateurs) {
      this.buildChartActions(this.state.indicateurs);
    }
    if (this.state.heures) {
      this.buildChartHeures(this.state.heures);
    }
  }

  private buildChartActivite(data: ActiviteData): void {
    const ctx = this.chartActiviteRef?.nativeElement;
    if (!ctx) return;
    const couleurs: Record<string, string> = {
      LOGIN:           '#2563eb',
      VIEW_ANNONCE:    '#7c3aed',
      CREATE_ANNONCE:  '#16a34a',
      SOLD_ANNONCE:    '#ca8a04',
      UPLOAD_PHOTO:    '#db2777',
      SEND_MESSAGE:    '#0891b2',
    };
    const labels: Record<string, string> = {
      LOGIN: 'Connexions', VIEW_ANNONCE: 'Consultations',
      CREATE_ANNONCE: 'Publications', SOLD_ANNONCE: 'Ventes',
      UPLOAD_PHOTO: 'Photos', SEND_MESSAGE: 'Messages',
    };
    const datasets = Object.entries(data.series).map(([action, values]) => ({
      label: labels[action] ?? action,
      data: values as number[],
      borderColor: couleurs[action] ?? '#6b7280',
      backgroundColor: (couleurs[action] ?? '#6b7280') + '22',
      fill: true,
      tension: 0.3,
      pointRadius: 2,
    }));
    this.charts.push(new Chart(ctx, {
      type: 'line',
      data: { labels: data.dates, datasets },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' }, title: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    }));
  }

  private buildChartActions(ind: Indicateurs): void {
    const ctx = this.chartActionsRef?.nativeElement;
    if (!ctx) return;
    this.charts.push(new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Connexions', 'Consultations', 'Publications', 'Ventes', 'Messages', 'Favoris', 'Photos'],
        datasets: [{
          data: [ind.connexions, ind.consultations, ind.publications, ind.ventes, ind.messages, ind.favorisAjoutes, ind.photosUploadees],
          backgroundColor: ['#2563eb','#7c3aed','#16a34a','#ca8a04','#0891b2','#f97316','#db2777'],
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'right' } }
      }
    }));
  }

  private buildChartHeures(data: HeuresData): void {
    const ctx = this.chartHeuresRef?.nativeElement;
    if (!ctx) return;
    this.charts.push(new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.heures.map((h: any) => h.heure),
        datasets: [{
          label: 'Actions',
          data: data.heures.map((h: any) => h.count),
          backgroundColor: data.heures.map((_: any, i: number) => i >= 8 && i <= 22 ? '#2563eb99' : '#2563eb33'),
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    }));
  }
}
