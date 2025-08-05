import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatToolbar } from "@angular/material/toolbar";

@Component({
  selector: 'app-portfolio',
  standalone: true,
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.css'],
  imports: [FormsModule, CommonModule, MatToolbar]
  
})
export class PortfolioComponent implements OnInit {
  portfolioStocks: any[] = [];
stock: any;

  ngOnInit() {
    this.loadPortfolio();
  }

  loadPortfolio() {
    this.portfolioStocks = JSON.parse(localStorage.getItem('portfolio') || '[]');
  }

  // Optionally: Remove a stock from portfolio
  removeFromPortfolio(symbol: string) {
    this.portfolioStocks = this.portfolioStocks.filter(s => s.symbol !== symbol);
    localStorage.setItem('portfolio', JSON.stringify(this.portfolioStocks));
  }

  trackStock(index: number, stock: any) {
  return stock.symbol;
}

}
