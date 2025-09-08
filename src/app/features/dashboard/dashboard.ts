import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
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

  selectedStock: any | null = null;

  chartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } }
  };

  constructor(private stocksService: StocksService) {}

  onStockSelected(stock: any) {
    this.selectedStock = stock;
    this.loadStockCandles(stock.symbol);
  }

  loadStockCandles(symbol: string) {
    this.stocksService.getCandles(symbol).subscribe(candles => {
      const labels = candles.map((c: any) =>
        new Date(c.t).toLocaleDateString()
      );
      const prices = candles.map((c: any) => c.c);

      this.chartData = {
        labels,
        datasets: [
          {
            data: prices,
            label: symbol,
            borderColor: prices[0] < prices[prices.length - 1] ? '#10b981' : '#ef4444',
            backgroundColor: 'rgba(255,255,255,0.05)',
            fill: true,
            tension: 0.3,
            pointRadius: 0
          }
        ]
      };
    });
  }
}
