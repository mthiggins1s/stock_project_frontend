import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PriceStreamService implements OnDestroy {
  private socket!: WebSocket;
  private apiKey = 'd2j62dhr01qqoaj9q9d0d2j62dhr01qqoaj9q9dg'; // ✅ your key
  private subject = new Subject<{ symbol: string; price: number }>();
  private isReady = false;
  private pending: string[] = []; // ✅ queue until ready

  constructor() {
    this.socket = new WebSocket(`wss://ws.finnhub.io?token=${this.apiKey}`);

    this.socket.addEventListener('open', () => {
      this.isReady = true;
      // ✅ flush queued messages
      this.pending.forEach(msg => this.socket.send(msg));
      this.pending = [];
    });

    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'trade' && data.data?.length > 0) {
        const trade = data.data[0];
        this.subject.next({ symbol: trade.s, price: trade.p });
      }
    });
  }

  // Subscribe to symbol
  subscribeToSymbol(symbol: string) {
    const msg = JSON.stringify({ type: 'subscribe', symbol });
    if (this.isReady) {
      this.socket.send(msg);
    } else {
      this.pending.push(msg);
    }
  }

  // Unsubscribe
  unsubscribeFromSymbol(symbol: string) {
    const msg = JSON.stringify({ type: 'unsubscribe', symbol });
    if (this.isReady) {
      this.socket.send(msg);
    } else {
      this.pending.push(msg);
    }
  }

  // Observable for updates
  onPriceUpdate(): Observable<{ symbol: string; price: number }> {
    return this.subject.asObservable();
  }

  ngOnDestroy() {
    this.socket.close();
  }
}