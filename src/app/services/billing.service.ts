import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StringResponse } from '../model/string-response.model';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  constructor(private httpClient: HttpClient) { }

  generateInvoiceId() : Observable<number> {
    return this.httpClient.get<number>(environment.baseUrl + "invoice/generateInvoiceId");
  }

  createInvoice(payload) {
    return this.httpClient.post<StringResponse>(environment.baseUrl + "invoice/createBill", payload);
  }
}
