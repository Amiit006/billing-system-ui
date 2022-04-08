import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private httpClient: HttpClient) { }

  getPurchasesBySeason(seasonId: number) {
    let params = new HttpParams();
    params = params.append('seasonId', seasonId.toString());
    return this.httpClient.get(environment.baseUrl + 'purchase', { params: params });
  }

  createPurchase(seasonId, payload) {
    let params = new HttpParams();
    params = params.append('seasonId', seasonId.toString());
    return this.httpClient.post(environment.baseUrl + 'purchase/create', payload, { params: params });
  }
}
