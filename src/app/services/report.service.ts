import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  getSellsReport(from_date, to_date) : Observable<any[]> {
    let params = new HttpParams();
    params = params.append('from_date', from_date);
    params = params.append('to_date', to_date);
    return this.http.get<any[]>(environment.baseUrl + "report/sells", { params: params }); 
  }

  getCollectionStats(from_date, to_date) : Observable<any[]> {
    let params = new HttpParams();
    params = params.append('from_date', from_date);
    params = params.append('to_date', to_date);
    return this.http.get<any[]>(environment.baseUrl + "report/collection", { params: params }); 
  }

  getClientReport(from_date, to_date, clientId) : Observable<any> {
    let params = new HttpParams();
    params = params.append('from_date', from_date);
    params = params.append('to_date', to_date);
    params = params.append('clientId', clientId);
    return this.http.get<any>(environment.baseUrl + "report/client", { params: params }); 
  }
}
