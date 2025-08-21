import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StocksService {
  private apiUrl = 'http://localhost:3000/stocks';

  constructor(private http: HttpClient) {}

  // ✅ Get list of stocks
  getStocks(search: string = ''): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      params: { search }
    });
  }

  // ✅ Get single stock quote
  getQuote(symbol: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${symbol}/quote`);
  }
}
