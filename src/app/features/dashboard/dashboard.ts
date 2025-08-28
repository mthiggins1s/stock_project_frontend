import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { StockChartComponent } from '../../stock-chart/stock-chart';
import { StockListComponent } from '../../stock-list/stock-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule, StockChartComponent, StockListComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  // --- Portfolio summary (mock for now) ---
  totalValue = 12500;
  totalGains = 2400;
  totalLosses = 800;

  // --- Portfolio Performance Line Chart ---
  portfolioChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        data: [12000, 12300, 12200, 12400, 12500],
        label: 'Portfolio',
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.2)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#10b981',
        pointRadius: 4,
      }
    ]
  };

  portfolioChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { display: true } }
  };

  // --- Stock Allocation Doughnut Chart ---
  allocationChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['AAPL', 'TSLA', 'AMZN', 'GOOG'],
    datasets: [
      {
        data: [25, 20, 15, 40],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
        hoverOffset: 8
      }
    ]
  };

  allocationChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };

  // --- New: Selected stock state ---
  selectedStock: string | null = null;

  onStockSelected(symbol: string) {
    this.selectedStock = symbol;
  }
}
