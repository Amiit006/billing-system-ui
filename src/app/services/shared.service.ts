import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  reload = new EventEmitter<boolean>();

  constructor() { }

  reloadClientOutstanding(isLoad) {
    this.reload.emit(isLoad);
  }
}
