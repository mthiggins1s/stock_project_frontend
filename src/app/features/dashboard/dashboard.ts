import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { StockListComponent } from '../../stock-list/stock-list';
import { StocksService } from '../../stocks.service';
import { AuthenticationService, User } from '../../core/services/authentication.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule, StockListComponent, MatSnackBarModule],
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
  showPublicId = false;

  chartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } }
  };

  constructor(
    private stocksService: StocksService,
    private authService: AuthenticationService,
    private portfolioService: PortfolioService,
    private snackBar: MatSnackBar
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

    // ✅ Load portfolio stats
    this.loadPortfolioStats();
  }

  loadPortfolioStats(): void {
    this.portfolioService.getMyPortfolio().subscribe({
      next: (portfolio) => {
        let totalValue = 0;
        let totalGains = 0;
        let totalLosses = 0;

        portfolio.forEach((holding) => {
          const price = holding.stock.current_price || 0;
          const shares = holding.shares || 0;
          const avgCost = holding.avg_cost || 0;

          const holdingValue = price * shares;
          const profitLoss = (price - avgCost) * shares;

          totalValue += holdingValue;
          if (profitLoss >= 0) {
            totalGains += profitLoss;
          } else {
            totalLosses += Math.abs(profitLoss);
          }
        });

        this.totalValue = totalValue;
        this.totalGains = totalGains;
        this.totalLosses = totalLosses;
      },
      error: (err) => console.error('Error loading portfolio for dashboard:', err)
    });
  }

  togglePublicId(): void {
    this.showPublicId = !this.showPublicId;
  }

  copyId(): void {
    if (this.user?.public_id) {
      navigator.clipboard.writeText(this.user.public_id).then(() => {
        this.copied = true;
        this.snackBar.open('Public ID copied to clipboard!', 'Close', { duration: 2000 });
        setTimeout(() => (this.copied = false), 2000);
      });
    }
  }

  logout() {
    this.authService.logout();
  }

  onStockSelected(stock: any) {
    this.selectedStock = stock;
    this.loadStockCandles(stock.symbol);
  }

  loadStockCandles(symbol: string) {
    this.stocksService.getCandles(symbol).subscribe(candles => {
      const labels = candles.map((c: any) => new Date(c.t).toLocaleDateString());
      const prices = candles.map((c: any) => c.c);

      this.chartData = {
        labels,
        datasets: [
          {
            data: prices,
            label: symbol,
            borderColor: prices[0] < prices[prices.length - 1] ? '#10b981' : '#ef4444',
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
