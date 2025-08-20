import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar";
import { trigger, transition, style, animate } from '@angular/animations';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [
    trigger('routeFade', [
      transition('* <=> *', [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate('320ms cubic-bezier(.4,0,.2,1)', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class App {
  protected readonly title = signal('stock_project_frontend');
}
