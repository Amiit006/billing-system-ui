import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Payment } from '../model/payment.model';
import { StringResponse } from '../model/string-response.model';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  constructor(private httpClient: HttpClient) { }

  generateInvoiceId(): Observable<number> {
    return this.httpClient.get<number>(environment.baseUrl + "invoice/generateInvoiceId");
  }

  createInvoice(payload) {
    return this.httpClient.post<StringResponse>(environment.baseUrl + "invoice/createBill", payload);
  }

  getInvoiceByClientId(clientId) {
    let params = new HttpParams();
    params = params.append('clientId', clientId.toString());
    return this.httpClient.get<Payment[]>(environment.baseUrl + "invoice/client", { params: params });
  }

  getInvoiceByInvoiceId(invoiceId) {
    return this.httpClient.get(environment.baseUrl + "invoice/" + invoiceId);
  }
}
