import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../../core/services/portfolio.service';

@Component({
  selector: 'app-portfolio-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portfolio-search.html',
  styleUrls: ['./portfolio-search.css']
})
export class PortfolioSearchComponent {
  publicId = '';
  results: any[] = [];
  error: string | null = null;
  loading = false;

  constructor(private portfolioService: PortfolioService) {}

  search() {
    this.error = null;
    this.results = [];
    this.loading = true;

    this.portfolioService.getPortfolioByPublicId(this.publicId).subscribe({
      next: (res) => {
        this.results = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'User not found';
        this.loading = false;
      }
    });
  }
}
