import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { StockChartComponent } from '../stock-chart/stock-chart'; // ✅ Import chart

@Component({
  selector: 'app-stock-card',
  standalone: true,
  templateUrl: './stock-card.html',
  styleUrls: ['./stock-card.css'],
  imports: [CommonModule, StockChartComponent] // ✅ Register chart here
})
export class StockCardComponent {
  @Input() stock: any;
  @Input() shares?: number;
  @Input() avgCost?: number;
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
}
