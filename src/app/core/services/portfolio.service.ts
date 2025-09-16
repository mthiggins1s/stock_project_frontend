import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Get logged-in user’s portfolio
  getMyPortfolio(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/portfolios`);
  }

  // Add a stock (now accepts symbol, name, current_price, shares, avgCost)
  addToPortfolio(symbol: string, name: string, currentPrice: number, shares: number, avgCost: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/portfolios`, {
      portfolio: { symbol, name, current_price: currentPrice, shares, avg_cost: avgCost }
    });
  }

  // Update a holding
  updatePortfolio(id: number, shares: number, avgCost: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/portfolios/${id}`, {
      portfolio: { shares, avg_cost: avgCost }
    });
  }

  // Delete a holding
  removeFromPortfolio(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/portfolios/${id}`);
  }

  // Get someone else’s portfolio by public ID
  getPortfolioByPublicId(publicId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/profiles/public/${publicId}/portfolio`);
  }

  addStock(stock: any) {
  console.log("Saving stock:", stock); // <-- add this
  const portfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');
  portfolio.push(stock);
  localStorage.setItem('portfolio', JSON.stringify(portfolio));
    }
}
