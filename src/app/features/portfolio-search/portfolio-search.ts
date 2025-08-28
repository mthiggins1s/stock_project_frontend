import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-portfolio-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portfolio-search.html',
  styleUrls: ['./portfolio-search.css']
})
export class PortfolioSearchComponent {
  publicId = '';
  results: any[] = [];
  error: string | null = null;
  loading = false;

  constructor(private http: HttpClient) {}

  search() {
    this.error = null;
    this.results = [];
    this.loading = true;

    this.http.get<any[]>(`http://localhost:3000/profiles/public/${this.publicId}/portfolio`)
      .subscribe({
        next: data => {
          this.results = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'No portfolio found for that ID';
          this.loading = false;
        }
      });
  }

  addToMyPortfolio(stock: any) {
    this.http.post(`http://localhost:3000/portfolios`, { symbol: stock.symbol })
      .subscribe(() => alert(`${stock.symbol} added to your portfolio!`));
  }
}
