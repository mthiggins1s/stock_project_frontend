import { Component, signal } from '@angular/core';
import { StockListComponent } from "./stock-list/stock-list";

@Component({
  selector: 'app-root',
  imports: [StockListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('stock_project_frontend');
}
