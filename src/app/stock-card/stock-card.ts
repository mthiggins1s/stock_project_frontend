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
  @Input() showRemove = false;
  @Output() remove = new EventEmitter<string>();

  handleRemove() {
    this.remove.emit(this.stock.symbol);
  }
}
