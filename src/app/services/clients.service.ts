import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

}
