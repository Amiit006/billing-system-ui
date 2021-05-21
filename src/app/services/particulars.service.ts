import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Particulars } from '../model/particulars.model';

@Injectable({
  providedIn: 'root'
})
export class ParticularsService {

  constructor(private http: HttpClient) { }

  getAllParticulars() : Observable<Particulars[]> {
    return this.http.get<Particulars[]>(environment.baseUrl + "particulars");
  }

  addParticular(particular: string) : Observable<string> {
    const toBeCreated: Particulars = {
      particularId: 0,
      particularName: particular
    }
    return this.http.post<string>(environment.baseUrl + "particulars", toBeCreated);
  }

  updateParticular(id: number, particular: string) : Observable<Particulars[]> {
    return this.http.get<Particulars[]>(environment.baseUrl + "particulars");
  }

  deleteParticular(id: number) : Observable<Particulars[]> {
    return this.http.get<Particulars[]>(environment.baseUrl + "particulars");
  }
}