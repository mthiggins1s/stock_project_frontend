import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { StockListComponent } from '../../stock-list/stock-list';
import { StocksService } from '../../stocks.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { AuthenticationService, User } from '../../core/services/authentication.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule, StockListComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  totalValue = 0;
  totalGains = 0;
  totalLosses = 0;

  selectedStock: any | null = null;
  user: User | null = null;
  copied = false;

  chartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } }
  };

  constructor(
    private stocksService: StocksService,
    private portfolioService: PortfolioService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    // ✅ Load user
    this.user = this.authService.getCachedUser();
    if (!this.user) {
      this.authService.getCurrentUser().subscribe({
        next: (res) => (this.user = res),
        error: (err) => console.error('Failed to load user:', err)
      });
    }

    // ✅ Load portfolio totals
    this.loadPortfolioSummary();
  }

  private loadPortfolioSummary() {
    this.portfolioService.getMyPortfolio().subscribe({
      next: (portfolio) => {
        this.calculateTotals(portfolio);
      },
      error: (err) => {
        console.error('Failed to load portfolio:', err);
      }
    });
  }

  private calculateTotals(portfolio: any[]) {
    let value = 0;
    let gains = 0;
    let losses = 0;

    portfolio.forEach((holding) => {
      const shares = holding.shares ?? 0;
      const avgCost = holding.avg_cost ?? holding.current_price ?? 0;
      const currentPrice = holding.current_price ?? 0;

      const holdingValue = shares * currentPrice;
      const pnl = (currentPrice - avgCost) * shares;

      value += holdingValue;
      if (pnl >= 0) {
        gains += pnl;
      } else {
        losses += pnl; // negative
      }
    });

    this.totalValue = value;
    this.totalGains = gains;
    this.totalLosses = losses;
  }

  copyId(): void {
    if (this.user?.public_id) {
      navigator.clipboard.writeText(this.user.public_id).then(() => {
        this.copied = true;
        setTimeout(() => (this.copied = false), 2000);
      });
    }
  }

  onStockSelected(stock: any) {
    this.selectedStock = stock;
    this.loadStockCandles(stock.symbol);
  }

  loadStockCandles(symbol: string) {
    this.stocksService.getCandles(symbol).subscribe((candles) => {
      const labels = candles.map((c: any) =>
        new Date(c.t).toLocaleDateString()
      );
      const prices = candles.map((c: any) => c.c);

      this.chartData = {
        labels,
        datasets: [
          {
            data: prices,
            label: symbol,
            borderColor:
              prices[0] < prices[prices.length - 1] ? '#10b981' : '#ef4444',
            backgroundColor: 'rgba(255,255,255,0.05)',
            fill: true,
            tension: 0.3,
            pointRadius: 0
          }
        ]
      };
    });
  }
}
