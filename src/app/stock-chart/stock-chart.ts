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
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false } // 🚫 no hover popups
    },
    elements: {
      line: { borderWidth: 2 },
      point: { radius: 0 }
    },
    scales: {
      x: { display: false }, // 🚫 hide x-axis
      y: { display: false }  // 🚫 hide y-axis
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
      const prices = candles.map((c: any) => c.c);

      this.chartData = {
        labels: prices.map((_: any, i: number) => i), // dummy labels
        datasets: [
          {
            data: prices,
            borderColor: prices[0] < prices[prices.length - 1] ? '#10b981' : '#ef4444',
            fill: false,
            tension: 0.3,
            pointRadius: 0
          }
        ]
      };
    });
  }
}
