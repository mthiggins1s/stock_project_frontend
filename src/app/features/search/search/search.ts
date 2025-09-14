import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // ✅ import FormsModule
import { environment } from '../../../../environments/environment'; // ✅ corrected path

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ add FormsModule here
  templateUrl: './search.html',
  styleUrls: ['./search.css'],
})
export class SearchComponent {
  query = '';
  loading = false;
  results: any[] = [];
  error: string | null = null;

  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  search() {
    if (!this.query) return;
    this.loading = true;
    this.error = null;

    this.http.get<any[]>(`${this.api}/profiles/${this.query}/portfolio`).subscribe({
      next: res => {
        this.results = res || [];
        this.loading = false;
      },
      error: err => {
        this.error = 'User not found or portfolio unavailable';
        this.loading = false;
      }
    });
  }
}
