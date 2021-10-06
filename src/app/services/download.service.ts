import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor() { }

  downloadFile(data: any, fileName) {
    console.log(data);
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    console.log(csv);
    let csvArray = csv.join('\r\n');
    console.log(csvArray);
    var blob = new Blob([csvArray], { type: 'text/csv' })
    saveAs(blob, fileName);
  }
}
