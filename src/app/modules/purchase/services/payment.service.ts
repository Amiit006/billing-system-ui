import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  createPayment(seasonId, purchaseId, payment) {
    let params = new HttpParams();
    params = params.append('seasonId', seasonId.toString())
      .append('purchaseId', purchaseId.toString());
    return this.http.post<any>(environment.baseUrl + "purchase/payment/create", payment, { params: params });
  }
}
