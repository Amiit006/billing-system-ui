import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InvoiceOverview } from '../model/invoice-overview.model';
import { StringResponse } from '../model/string-response.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  generatePaymentId() {
    return this.http.get<number>(environment.baseUrl + "payment/generatePaymentId");
  }

  getPaymentByClientId(clientId) {
    let params = new HttpParams();
    params = params.append('clientId', clientId.toString());
    return this.http.get<any>(environment.baseUrl + "payment", {params: params});
  }

  createPayment(payload) {
    return this.http.post<StringResponse>(environment.baseUrl + "payment", payload);
  }
}
