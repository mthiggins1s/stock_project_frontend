import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stock-chart',
  standalone: true,
  templateUrl: './stock-chart.html',
  styleUrls: ['./stock-chart.css']
})
export class StockChartComponent implements OnChanges {
  @Input() symbol: string | null = null;
  candles: any[] = [];
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['symbol'] && this.symbol) {
      this.fetchCandles(this.symbol);
    }
  }

  fetchCandles(symbol: string) {
    this.loading = true;
    this.http.get<any[]>(`http://localhost:3000/stocks/${symbol}/candles`)
      .subscribe({
        next: (data) => {
          this.candles = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }
}
