import { Component, OnInit } from '@angular/core';
import { StocksService } from '../stocks.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.html',
  styleUrls: ['./stock-list.css'],
  imports: [CommonModule, FormsModule]
})
export class StockListComponent implements OnInit {

  stocks: any[] = [];
  search: string = '';
  // Keep track of which stocks have been added to the portfolio
  addedStockSymbols: Set<string> = new Set();

  constructor(
    private stocksService: StocksService) {}

  // Runs once when the component is initialized; load the stock list
  ngOnInit(): void {
    this.loadStocks();
  }

  // Fetch stocks from the service, and update the UI to show which are added
  loadStocks() {
    this.stocksService.getStocks(this.search).subscribe(data => {
      data.forEach((stock: any) => {
        // Mark as added if already in the portfolio
        stock.added = this.addedStockSymbols.has(stock.symbol);
      });
      this.stocks = data;
    });
  }

  // Called when the search input changes; reload the list with the new search
  onSearchChange() {
    this.loadStocks();
  }

  // Called when "Add" is clicked; mark the stock as added and show an alert
  addToPortfolio(stock: any) {
    stock.added = true;
    this.addedStockSymbols.add(stock.symbol);
    alert('Stock has been added to your portfolio.');
  }
}