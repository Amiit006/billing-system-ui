import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StringResponse } from '../model/string-response.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  generatePaymentId() {
    return this.http.get<number>(environment.baseUrl + "payment/generatePaymentId");
  }

  createPayment(payload) {
    return this.http.post<StringResponse>(environment.baseUrl + "payment", payload);
  }
}
