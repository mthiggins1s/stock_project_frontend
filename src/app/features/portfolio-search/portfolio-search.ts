import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PortfolioService } from '../../core/services/portfolio.service';
import { StockCardComponent } from '../../stock-card/stock-card';

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

  constructor(
    private portfolioService: PortfolioService,
    private snackBar: MatSnackBar
  ) {}

  /** 🔎 Search for a portfolio by its public ID */
  search(): void {
    this.error = null;
    this.results = [];
    this.loading = true;

    this.portfolioService.getPortfolioByPublicId(this.publicId).subscribe({
      next: (res: any[]) => {
        // ✅ Ensure shape is consistent with regular portfolio
        this.results = res.map((holding: any) => ({
          ...holding,
          stock: holding.stock || holding
        }));
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'User not found';
        this.loading = false;
      }
    });
  }

  /** 💾 Save the currently loaded portfolio into the logged-in user’s account */
  savePortfolio(): void {
    if (!this.results.length) return;

    // Create requests for each holding
    const requests = this.results.map((holding) =>
      this.portfolioService.addToPortfolio(
        holding.stock.symbol,
        holding.stock.name,
        holding.stock.current_price,
        holding.shares,
        holding.avg_cost // ✅ supported now
      )
    );

    // Wait for all requests to finish
    Promise.all(requests.map((req) => req.toPromise()))
      .then(() => {
        this.snackBar.open('Portfolio saved to your account!', 'Close', {
          duration: 3000
        });
      })
      .catch(() => {
        this.snackBar.open('Error saving portfolio', 'Close', { duration: 3000 });
      });
  }
}
