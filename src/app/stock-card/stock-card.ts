import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-stock-card',
  standalone: true,
  templateUrl: './stock-card.html',
  styleUrls: ['./stock-card.css'],
  imports: [CommonModule, NgChartsModule]
})
export class StockCardComponent {
  @Input() stock: any;
  @Input() shares?: number;
  @Input() avgCost?: number;
  @Input() candles: number[] | null = null; // ✅ sparkline data
  @Input() showRemove = false;

  @Output() remove = new EventEmitter<number>();

  handleRemove() {
    this.remove.emit(this.stock?.id);
  }

  get currentPrice(): number {
    return this.stock?.current_price ?? this.stock?.price ?? 0;
  }

  get normalizedAvgCost(): number {
    return this.avgCost ?? this.stock?.avg_cost ?? 0;
  }

  get gainLoss(): number {
    if (!this.shares || !this.normalizedAvgCost) return 0;
    return (this.currentPrice - this.normalizedAvgCost) * this.shares;
  }

  get gainLossPercent(): number {
    if (!this.normalizedAvgCost) return 0;
    return ((this.currentPrice - this.normalizedAvgCost) / this.normalizedAvgCost) * 100;
  }

  get isGain(): boolean {
    return this.gainLoss >= 0;
  }

  // ✅ Build chartData for inline sparkline
  get chartData(): ChartConfiguration<'line'>['data'] | null {
    if (!this.candles) return null;

    return {
      labels: this.candles.map((_, i) => i.toString()), // hide labels later
      datasets: [
        {
          data: this.candles,
          borderColor:
            this.candles[0] < this.candles[this.candles.length - 1]
              ? '#10b981'
              : '#ef4444',
          backgroundColor: 'rgba(255,255,255,0.05)',
          fill: true,
          tension: 0.3,
          pointRadius: 0 // ✅ remove circles
        }
      ]
    };
  }

  get chartOptions(): ChartConfiguration<'line'>['options'] {
    return {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    };
  }
}
