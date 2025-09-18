import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StockCardComponent } from '../stock-card/stock-card';
import { PortfolioService } from '../core/services/portfolio.service';
import { StocksService } from '../stocks.service';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.css'],
  imports: [CommonModule, StockCardComponent, NgChartsModule]
})
export class PortfolioComponent implements OnInit {
  portfolio: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private portfolioService: PortfolioService,
    private stocksService: StocksService
  ) {}

  ngOnInit() {
    this.loadPortfolio();
  }

  loadPortfolio() {
    this.loading = true;
    this.error = null;

    this.portfolioService.getMyPortfolio().subscribe({
      next: (data) => {
        this.portfolio = data;

        // fetch candles for each stock in portfolio
        this.portfolio.forEach((holding) => {
          const symbol = holding.stock?.symbol || holding.symbol;
          if (symbol) {
            this.stocksService.getCandles(symbol).subscribe({
              next: (candles) => {
                holding.candles = candles;
                holding.chartData = this.formatCandlesForChart(candles);
              },
              error: (err) => {
                console.warn(`Failed to fetch candles for ${symbol}`, err);
              }
            });
          }
        });

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

  formatCandlesForChart(candles: any[]) {
    return {
      labels: candles.map(c => new Date(c.t).toLocaleDateString()),
      datasets: [
        {
          label: 'Price',
          data: candles.map(c => c.c), // closing prices
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          fill: true,
          tension: 0.3
        }
      ]
    };
  }

  removeFromPortfolio(id: number) {
    this.portfolioService.removeFromPortfolio(id).subscribe({
      next: () => {
        this.portfolio = this.portfolio.filter(p => p.id !== id);
        localStorage.setItem('portfolio', JSON.stringify(this.portfolio));
      },
      error: (err) => {
        console.error('Error removing stock:', err);
      }
    });
  }
}
