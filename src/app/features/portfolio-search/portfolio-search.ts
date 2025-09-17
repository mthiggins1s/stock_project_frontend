import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../../core/services/portfolio.service';
import { StockCardComponent } from '../../stock-card/stock-card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-portfolio-search',
  standalone: true,
  imports: [CommonModule, FormsModule, StockCardComponent, MatSnackBarModule],
  templateUrl: './portfolio-search.html',
  styleUrls: ['./portfolio-search.css']
})
export class PortfolioSearchComponent {
  publicId = '';
  results: any[] = [];
  error: string | null = null;
  loading = false;

  constructor(private portfolioService: PortfolioService, private snackBar: MatSnackBar) {}

  search() {
    this.error = null;
    this.results = [];
    this.loading = true;

    this.portfolioService.getPortfolioByPublicId(this.publicId).subscribe({
      next: (res: any[]) => {
        this.results = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'User not found';
        this.loading = false;
      }
    });
  }

  savePortfolio() {
    if (!this.results.length) return;

    let requests = this.results.map(holding =>
      this.portfolioService.addToPortfolio(
        holding.stock.symbol,
        holding.stock.name,
        holding.stock.current_price,
        holding.shares,
        holding.avg_cost
      )
    );

    Promise.all(requests.map(req => req.toPromise()))
      .then(() => {
        this.snackBar.open('Portfolio saved to your account!', 'Close', { duration: 3000 });
      })
      .catch(() => {
        this.snackBar.open('Error saving portfolio', 'Close', { duration: 3000 });
      });
  }
}
