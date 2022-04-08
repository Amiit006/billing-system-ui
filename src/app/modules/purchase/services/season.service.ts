import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {

  constructor(private httpClient: HttpClient) { }

  refreshViewData = new EventEmitter<boolean>();

  refreshView(data) {
    this.refreshViewData.emit(data);
  }

  findAllSeasons(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'purchase/season');
  }

  createSeason(payload) {
    return this.httpClient.post(environment.baseUrl + "purchase/season/create", payload);
  }

  updateSeason(clientId, invoiceId, billAmountDetails, remarks) {
    let params = new HttpParams();
    params = params.append('remarks', remarks.toString());
    // return this.httpClient.put(environment.baseUrl + "invoice/addDiscount/" + 
    //   clientId + "/" + invoiceId, billAmountDetails, { params: params });
  }
}
