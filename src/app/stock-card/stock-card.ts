import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-stock-card',
  standalone: true,
  templateUrl: './stock-card.html',
  styleUrls: ['./stock-card.css'],
  imports: [CommonModule]
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

  get gainLoss(): number {
    if (!this.shares || !this.avgCost || !this.stock?.current_price) return 0;
    return (this.stock.current_price - this.avgCost) * this.shares;
  }

  get gainLossPercent(): number {
    if (!this.avgCost || !this.stock?.current_price) return 0;
    return ((this.stock.current_price - this.avgCost) / this.avgCost) * 100;
  }

  get isGain(): boolean {
    return this.gainLoss >= 0;
  }
}
