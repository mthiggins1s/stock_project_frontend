import { Component, Input, AfterViewInit, OnChanges, SimpleChanges, ElementRef } from '@angular/core';

@Component({
  selector: 'app-tradingview-mini',
  templateUrl: './tradingview-mini.html',
  styleUrls: ['./tradingview-mini.css'],
  standalone: true,
})
export class TradingviewMiniComponent implements AfterViewInit, OnChanges {
  @Input() symbol: string | null = null;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.loadWidget();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['symbol'] && !changes['symbol'].firstChange) {
      this.loadWidget();
    }
  }

  loadWidget() {
    const container = this.el.nativeElement.querySelector('.tradingview-widget-container');
    if (container) container.innerHTML = '';

    if (!this.symbol) return;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.innerHTML = JSON.stringify({
      "symbol": this.symbol,
      "chartOnly": false,
      "dateRange": "12M",
      "noTimeScale": false,
      "colorTheme": "dark",
      "isTransparent": false,
      "locale": "en",
      "width": "350",
      "autosize": true,
      "height": "200"
    });

    container.appendChild(script);
  }
}
