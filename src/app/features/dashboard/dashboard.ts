import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { StockChartComponent } from '../../stock-chart/stock-chart';
import { StockListComponent } from '../../stock-list/stock-list';
import { StocksService } from '../../stocks.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule, StockListComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  totalValue = 12500;
  totalGains = 2400;
  totalLosses = 800;

  portfolioChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Portfolio',
        borderColor: '#facc15',
        backgroundColor: 'rgba(250,204,21,0.2)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#facc15',
        pointRadius: 3,
      }
    ]
  };

  portfolioChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { display: true } }
  };

  selectedStock: string | null = null;

  constructor(private stocksService: StocksService) {}

  onStockSelected(symbol: string) {
    this.selectedStock = symbol;
    this.loadStockCandles(symbol);
  }

  loadStockCandles(symbol: string) {
    this.stocksService.getCandles(symbol).subscribe(candles => {
      const labels = candles.map((c: any) => new Date(c.t).toLocaleDateString());
      const prices = candles.map((c: any) => c.c);

      this.portfolioChartData = {
        labels,
        datasets: [
          {
            data: prices,
            label: symbol,
            borderColor: '#facc15',
            backgroundColor: 'rgba(250,204,21,0.2)',
            fill: true,
            tension: 0.3,
            pointBackgroundColor: '#facc15',
            pointRadius: 3,
          }
        ]
      };
    });
  }
}
