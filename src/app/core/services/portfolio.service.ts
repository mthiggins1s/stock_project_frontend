import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // ✅ Get holdings (each has stock info + shares + avg_cost)
  getMyPortfolio(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/portfolios`);
  }

  // ✅ Add stock to portfolio with shares + avg_cost
  addToPortfolio(
    symbol: string,
    name: string,
    current_price: number,
    shares = 1
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/portfolios`, {
      symbol,
      name,
      current_price,
      shares,
      avg_cost: current_price
    });
  }

  // ✅ Update portfolio entry (will need backend update action)
  updatePortfolio(
    id: number,
    shares: number,
    avgCost: number
  ): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/portfolios/${id}`, {
      shares,
      avg_cost: avgCost
    });
  }

  // ✅ Remove a stock from portfolio (by portfolio_stock.id)
  removeFromPortfolio(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/portfolios/${id}`);
  }

  // ✅ Get portfolio by public ID (for sharing)
  getPortfolioByPublicId(publicId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/profiles/public/${publicId}/portfolio`
    );
  }
}
