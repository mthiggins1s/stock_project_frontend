import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-portfolio-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portfolio-search.html',
  styleUrls: ['./portfolio-search.css']
})
export class PortfolioSearchComponent {
  publicId = '';
  results: any = null;
  error: string | null = null;
  loading = false;

  constructor(private http: HttpClient) {}

  search() {
    this.error = null;
    this.results = null;
    this.loading = true;

    this.http.get(`${environment.apiUrl}/users/${this.publicId}`)
      .subscribe({
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
