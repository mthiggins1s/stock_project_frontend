import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StocksService {
  private apiUrl = 'http://localhost:3000/stocks'; // ✅ your Rails API root

  constructor(private http: HttpClient) {}

  // Get stock list (with optional search)
  getStocks(search?: string): Observable<any[]> {
    let url = this.apiUrl;
    if (search) {
      url += `?search=${encodeURIComponent(search)}`;
    }
    return this.http.get<any[]>(url);
  }

  // Get live quote for one symbol
  getQuote(symbol: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${symbol}/quote`);
  }

}
