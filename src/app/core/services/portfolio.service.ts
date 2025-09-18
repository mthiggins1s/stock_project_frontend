import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getMyPortfolio(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/portfolios`);
  }

  addToPortfolio(symbol: string, name: string, current_price: number): Observable<any> {
    // 🔑 send flat JSON body, not wrapped in "portfolio"
    return this.http.post<any>(`${this.apiUrl}/portfolios`, {
      symbol,
      name,
      current_price,
      shares: 1,
      avg_cost: current_price
    });
  }

  updatePortfolio(id: number, shares: number, avgCost: number): Observable<any> {
    // This will need matching backend support (not in your controller yet!)
    return this.http.put<any>(`${this.apiUrl}/portfolios/${id}`, {
      shares,
      avg_cost: avgCost
    });
  }

  removeFromPortfolio(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/portfolios/${id}`);
  }

  getPortfolioByPublicId(publicId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/profiles/public/${publicId}/portfolio`);
  }
}
