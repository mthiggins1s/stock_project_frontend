import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StocksService {
  private apiKey = 'd2j62dhr01qqoaj9q9d0d2j62dhr01qqoaj9q9dg'; // ✅ your Finnhub key
  private apiUrl = 'https://finnhub.io/api/v1';

  constructor(private http: HttpClient) {}

  // ✅ Get list of US stocks from Finnhub
  getStocks(search?: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stock/symbol?exchange=US&token=${this.apiKey}`).pipe(
      map((symbols: any[]) => {
        // Filter out junk tickers like warrants, units, test issues
        let filtered = symbols.filter(s =>
          !s.symbol.includes('.') &&         // remove weird suffixes
          !s.symbol.endsWith('W') &&         // remove warrants
          !s.symbol.endsWith('U') &&         // remove units
          !s.symbol.endsWith('R') &&         // remove rights
          s.type === 'Common Stock'          // only common stocks
        );

        // ✅ Search filter (optional)
        if (search) {
          const term = search.toLowerCase();
          filtered = filtered.filter(s =>
            s.symbol.toLowerCase().includes(term) ||
            (s.description && s.description.toLowerCase().includes(term))
          );
        }

        return filtered;
      })
    );
  }
}
