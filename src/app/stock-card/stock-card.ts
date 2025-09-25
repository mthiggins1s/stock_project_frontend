import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-stock-card',
  standalone: true,
  templateUrl: './stock-card.html',
  styleUrls: ['./stock-card.css'],
  imports: [CommonModule, NgChartsModule] // ✅ removed NgChartsConfiguration
})
export class StockCardComponent {
  @Input() stock: any;
  @Input() shares?: number;
  @Input() avgCost?: number;
  @Input() showRemove = false;

  @Output() remove = new EventEmitter<string>();

  handleRemove() {
    this.remove.emit(this.stock?.symbol || '');
  }

  /** Current price (fallbacks included) */
  get currentPrice(): number {
    return this.stock?.current_price ?? this.stock?.price ?? 0;
  }

  /** Normalized average cost */
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

  // ✅ Add chartData + chartOptions
  chartData: ChartConfiguration<'line'>['data'] = {
    labels: [], // you’ll fill these with dates/times
    datasets: [
      {
        data: [], // you’ll fill this with stock prices
        label: 'Price',
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66, 165, 245, 0.1)',
        fill: true,
        tension: 0.3
      }
    ]
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    elements: { point: { radius: 0 } }
  };
}
