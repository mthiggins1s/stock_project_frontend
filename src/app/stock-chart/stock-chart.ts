import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { StocksService } from '../stocks.service';

@Component({
  selector: 'app-stock-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './stock-chart.html',
  styleUrls: ['./stock-chart.css']
})
export class StockChartComponent implements OnChanges {
  @Input() symbol: string | null = null;

  chartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      }
    }
  };

  constructor(private stocksService: StocksService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['symbol'] && this.symbol) {
      this.loadCandles(this.symbol);
    }
  }

  loadCandles(symbol: string) {
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
            backgroundColor: 'rgba(250, 204, 21, 0.05)',
            fill: true,
            tension: 0.3,
            pointRadius: 0
          }
        ]
      };
    });
  }
}
