import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { finalize, Subject, takeUntil } from 'rxjs';
import { StatsService } from '../../../core/services/stat.service';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { Router, RouterModule } from '@angular/router';

interface SummaryStats {
  totalStudents: number;
  totalTeachers?: number;
  totalClasses?: number;
  totalGroups?: number;
  totalSessions?: number;
  attendanceRate: number;
  upcomingSessions: number;
  totalDepartments?: number;
}

interface ChartData {
  labels: string[];
  values: number[];
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, NgChartsModule,RouterModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isLoading = true;
  isAdmin = false;
  stats: SummaryStats = {
    totalStudents: 0,
    attendanceRate: 0,
    upcomingSessions: 0
  };
  
  // Chart configurations
  barChartData = {
    labels: [] as string[],
    datasets: [{
      label: 'Students by Class',
      data: [] as number[],
      backgroundColor: [] as string[],
      borderColor: [] as string[],
      borderWidth: 1
    }]
  };

  pieChartData = {
    labels: [] as string[],
    datasets: [{
      data: [] as number[],
      backgroundColor: [] as string[],
      hoverOffset: 4
    }]
  };

  lineChartData = {
    labels: [] as string[],
    datasets: [{
      label: 'Attendance Rate %',
      data: [] as number[],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      }
    }
  };

  constructor(
    private statsService: StatsService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    const userData = this.authService.getDataFromToken();
    this.isAdmin = userData?.role === 'admin';

    if(userData.role =='stagiaire'){
      this.router.navigate(['/dashboard/voir-actualite'])
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.isLoading = true;
    
    this.statsService.getSummaryStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: SummaryStats) => {
          this.stats = data;
          console.log('Résumé reçu du backend:', data); // ← AJOUTE ICI
        },
        error: (err) => console.error('Error loading summary stats:', err)
      });

    this.statsService.getStudentDistribution()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: ChartData) => {
          this.barChartData = {
            ...this.barChartData,
            labels: data.labels,
            datasets: [{
              ...this.barChartData.datasets[0],
              data: data.values,
              backgroundColor: this.generateColors(data.values.length),
              borderColor: this.generateColors(data.values.length, false)
            }]
          };
        },
        error: (err) => console.error('Error loading student distribution:', err)
      });

    if (this.isAdmin) {
      this.statsService.getDepartmentDistribution()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data: ChartData) => {
            this.pieChartData = {
              ...this.pieChartData,
              labels: data.labels,
              datasets: [{
                ...this.pieChartData.datasets[0],
                data: data.values,
                backgroundColor: this.generateColors(data.values.length)
              }]
            };
          },
          error: (err) => console.error('Error loading department distribution:', err)
        });
    }

    this.statsService.getAttendanceTrend()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (data: ChartData) => {
          this.lineChartData = {
            ...this.lineChartData,
            labels: data.labels,
            datasets: [{
              ...this.lineChartData.datasets[0],
              data: data.values
            }]
          };
        },
        error: (err) => console.error('Error loading attendance trend:', err)
      });
  }

  private generateColors(count: number, transparent: boolean = true): string[] {
    const colors = [
      'rgba(54, 162, 235, OPACITY)',  // Blue
      'rgba(255, 99, 132, OPACITY)',  // Red
      'rgba(75, 192, 192, OPACITY)',  // Teal
      'rgba(255, 206, 86, OPACITY)',  // Yellow
      'rgba(153, 102, 255, OPACITY)', // Purple
      'rgba(255, 159, 64, OPACITY)'   // Orange
    ];
    
    const opacity = transparent ? '0.7' : '1';
    return colors.slice(0, count).map(c => c.replace('OPACITY', opacity));
  }
}