import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StocksService {
  private apiUrl = 'http://localhost:3000/stocks';

  constructor(private http: HttpClient) {}

  getStocks(search?: string): Observable<any[]> {
    let url = this.apiUrl;
    if (search) {
      url += `?search=${encodeURIComponent(search)}`;
    }
    return this.http.get<any[]>(url);
  }
}
