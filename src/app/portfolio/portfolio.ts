import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StockCardComponent } from '../stock-card/stock-card';
import { PortfolioService } from '../core/services/portfolio.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.css'],
  imports: [CommonModule, StockCardComponent, MatSnackBarModule]
})
export class PortfolioComponent implements OnInit {
  portfolio: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private portfolioService: PortfolioService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadPortfolio();
  }

  loadPortfolio() {
    this.loading = true;
    this.error = null;

    this.portfolioService.getMyPortfolio().subscribe({
      next: (data) => {
        this.portfolio = data;
        localStorage.setItem('portfolio', JSON.stringify(data));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading portfolio:', err);
        this.error = 'Failed to load portfolio';
        this.loading = false;
      }
    });
  }

  removeFromPortfolio(id: number) {
    this.portfolioService.removeFromPortfolio(id).subscribe({
      next: () => {
        this.portfolio = this.portfolio.filter(p => p.id !== id);
        localStorage.setItem('portfolio', JSON.stringify(this.portfolio));
        this.snackBar.open('Stock removed from portfolio', 'Close', { duration: 2000 });
      },
      error: (err) => {
        console.error('Error removing stock:', err);
        this.snackBar.open('Failed to remove stock', 'Close', { duration: 2000 });
      }
    });
  }
}
