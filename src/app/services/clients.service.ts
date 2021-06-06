import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Client } from '../model/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private http: HttpClient) { }

  getAllParticulars(): Observable<Client[]> {
    return this.http.get<Client[]>(environment.baseUrl + "clients");
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(environment.baseUrl + "clients", client);
  }

  updateClient(clientId :number, clientForm: FormGroup): Observable<Client> {
    
    return this.http.put<Client>(environment.baseUrl + "clients/" + clientId, clientForm.getRawValue());
  }

  getClientById(clientId: number): Observable<Client> {
    let params = new HttpParams();
    params = params.append('clientId', clientId.toString());
    return this.http.get<Client>(environment.baseUrl + "clients/client", {params: params});
  }

}
