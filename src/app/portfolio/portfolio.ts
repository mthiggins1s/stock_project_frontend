import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StockCardComponent } from '../stock-card/stock-card';
import { PortfolioService } from '../core/services/portfolio.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.css'],
  imports: [CommonModule, StockCardComponent]
})
export class PortfolioComponent implements OnInit {
  portfolio: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit() {
    this.loadPortfolio();
  }

  loadPortfolio() {
    this.loading = true;
    this.error = null;

    this.portfolioService.getMyPortfolio().subscribe({
      next: (data) => {
        this.portfolio = data;
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
      },
      error: (err) => {
        console.error('Error removing stock:', err);
      }
    });
  }
}
