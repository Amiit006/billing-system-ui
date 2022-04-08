import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChartResponse } from 'src/app/model/chart-response.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardServiceService {

  constructor(private http: HttpClient) { }

  getPurchasePaymentStats(seasonId): Observable<ChartResponse[]> {
    return this.http.get<ChartResponse[]>(environment.baseUrl + "purchase/dashboard?seasonId=" + seasonId);
  }
}
