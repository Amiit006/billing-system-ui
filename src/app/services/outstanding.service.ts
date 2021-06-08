import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OutstandingService {

  constructor(private http: HttpClient) { }

  getOutstandingById(clientId) {
    let params = new HttpParams();
    params = params.append('clientId', clientId.toString());
    return this.http.get<number>(environment.baseUrl + "client-outstanding", { params: params });
  }


}
