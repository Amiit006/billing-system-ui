import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-client-report',
  templateUrl: './client-report.component.html',
  styleUrls: ['./client-report.component.css']
})
export class ClientReportComponent implements OnInit {

  test = new Map();

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.test['invoiceId'] = 'Invoice Id';
    this.test['invoiceDate'] = 'Invoice Date';
    this.test['clientName'] = 'Client Name';
    this.test['subTotalAmount'] = 'Subtotal Amount';
    this.test['discountAmount'] = 'Discount Amount';
    this.test['grandTotalAmount'] = 'Grand Total Amount';
  }

  getData(): Observable<any> {
    return this.reportService.getSellsReport('2021-09-01', '2021-09-30');
  }

}
