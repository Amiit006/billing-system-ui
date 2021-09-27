import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ChartResponse } from '../model/chart-response.model';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {
    
  }

  getTopSellingProduct(topCount: number): Observable<any> {
    return this.http.get(environment.baseUrl + 'dashboard/topProduct?topCount=' + topCount);

  }

  getTopBuyer(topCount: number): Observable<any> {
    return this.http.get(environment.baseUrl + 'dashboard/topBuyer?topCount=' + topCount);
  }

  getSellCollectionStats(year: number): Observable<any> {
    return this.http.get(environment.baseUrl + 'dashboard/sellCollectionStats?year=' + year);
  }

  getMonthlySellStats(): Observable<ChartResponse[]> {
    return this.http.get<ChartResponse[]>(environment.baseUrl + 'dashboard/monthlySellStats');
  }
}
