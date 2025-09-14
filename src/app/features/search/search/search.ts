import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { StockCardComponent } from '../../../stock-card/stock-card';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, StockCardComponent], // ✅ add card
  templateUrl: './search.html',
  styleUrls: ['./search.css'],
})
export class SearchComponent {
  query = '';
  loading = false;
  results: any[] = [];
  error: string | null = null;

  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  search() {
    if (!this.query) return;
    this.loading = true;
    this.error = null;
    this.results = [];

    this.http
      .get<any[]>(`${this.api}/profiles/public/${this.query}/portfolio`)
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.results =
            res?.map((s) => ({
              symbol: s.symbol,
              name: s.name,
              logo_url: s.logo_url, // ✅ include logo if backend sends it
              price: s.current_price ?? 0,
              change: s.change ?? 0,
              change_percent: s.change_percent ?? 0,
              open: s.open ?? null,
              high: s.high ?? null,
              low: s.low ?? null,
              close: s.close ?? null,
            })) || [];
        },
        error: () => {
          this.loading = false;
          this.error = 'User not found or portfolio unavailable';
        },
      });
  }
}
