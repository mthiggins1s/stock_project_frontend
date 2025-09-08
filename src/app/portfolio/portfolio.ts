import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.css'],
  imports: [CommonModule]
})
export class PortfolioComponent implements OnInit {
  portfolio: any[] = [];

  ngOnInit() {
    this.loadPortfolio();
  }

  loadPortfolio() {
    this.portfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');
  }

  removeFromPortfolio(symbol: string) {
    this.portfolio = this.portfolio.filter(s => s.symbol !== symbol);
    localStorage.setItem('portfolio', JSON.stringify(this.portfolio));
  }

  trackStock(index: number, stock: any) {
    return stock.symbol;
  }
}
