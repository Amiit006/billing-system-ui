import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ChartResponse } from 'src/app/model/chart-response.model';
import { Client } from 'src/app/model/client.model';
import { ClientsService } from 'src/app/services/clients.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-client-report',
  templateUrl: './client-report.component.html',
  styleUrls: ['./client-report.component.css']
})
export class ClientReportComponent implements OnInit {

  clientDetails: Client[];
  billingClientForm = this.fb.group({
    'clientId': [],
    'clientName': ['']
  });

  reportStatus = "notloaded";
  showReport = false;
  single: ChartResponse[] = [];
  view: any[] = [1100, 200];
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  cardColor: string = '#232837';


  // Collection Details:
  collectionDisplayedColumns: string[] = ['paymentId', 'paymentDate', 'clientName', 'amount', 'paymentMode'];
  collectionDisplayedColumnsValue: string[] = ['Payment Id', 'Payment Date', 'Client Name', 'Amount', 'Payment Mode'];

  collectionDataSource = new MatTableDataSource();
  @ViewChild(MatSort) collectionSort: MatSort;
  @ViewChild(MatPaginator) collectionPaginator: MatPaginator;

  //Sell Details: 
  sellDisplayedColumns: string[] = ['invoiceId', 'invoiceDate', 'clientName', 'subTotalAmount', 'discountAmount', 'grandTotalAmount'];
  sellDisplayedColumnsValue: string[] = ['Invoice Id', 'Invoice Date', 'Client Name', 'SubTotalAmount', 'DiscountAmount', 'GrandTotalAmount'];
  sellDataSource = new MatTableDataSource();
  @ViewChild(MatSort) sellSort: MatSort;
  @ViewChild(MatPaginator) sellPaginator: MatPaginator;

  clientTradeBookDisplayedColumns: string[] = ['date', 'remark', 'amount', 'balance'];
  clientTradeBookDisplayedColumnsValue: string[] = ['date', 'remark', 'amount', 'balance'];
  clientTradeBookDataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) clientTradeBookPaginator: MatPaginator;
  clientTradeBookData:any[] = [];
  constructor(private fb: FormBuilder, private reportService: ReportService
    , private dashboardService: DashboardService, private clientService: ClientsService
    , private tosterService: ToastrService
  ) {

    this.clientService.getAllClients().subscribe(data => {
      this.clientDetails = data;
    });
  }

  ngOnInit(): void {
  }

  range;
  setRangeEmitter(range) {
    this.range = range;
    this.reportStatus = "loading";
    // this.showReport = true;
    const clientId = this.clientDetails.filter(x => x.clientName === this.billingClientForm.get("clientName")?.value)[0]?.clientId;
    if (clientId === undefined || clientId === null) {
      this.tosterService.error("Please select a client");
      return;
    }
    const from_date = moment(range.get("start").value).format('yyyy-MM-DD');
    const to_date = moment(range.get("end").value).format('yyyy-MM-DD');
    this.dashboardService.getSellCollectionStatsByClientId(from_date, to_date, clientId)
      .subscribe(data => {
        this.single = data;
        this.reportStatus = "loaded";
      },
        error => {
          console.log(error.error.error);
          this.reportStatus = "error";
        });
    this.reportService.getClientReport(from_date, to_date, clientId).subscribe(data => {
      this.collectionDataSource = new MatTableDataSource(data.clientCollection);
      this.collectionDataSource.sort = this.collectionSort;
      this.collectionDataSource.paginator = this.collectionPaginator;

      this.sellDataSource = new MatTableDataSource(data.clientSell);
      this.sellDataSource.sort = this.sellSort;
      this.sellDataSource.paginator = this.sellPaginator;
      this.reportStatus = "loaded";
    })
    this.reportService.getClientTradeBookReport(from_date, to_date, clientId).subscribe(data => {
      this.clientTradeBookDataSource = new MatTableDataSource(data);
      this.clientTradeBookDataSource.paginator = this.clientTradeBookPaginator;
      this.reportStatus = "loaded";
    })
  }

  onPrint() {
    console.log(this.clientTradeBookDataSource.data);
    this.clientTradeBookData = this.clientTradeBookDataSource.data;
    let html = `
    <div class="container">
  <div class="row">
    <div class="col-12 text-center">!!! Shree Ganeshaya Namaha !!!</div>
  </div>
  <div class="row mt-3">
    <div class="col-12 text-left">Client Name: ` + this.billingClientForm.get("clientName").value + `</div>
    <div class="col-12 text-left mt-3 mb-3">Period From : ` + moment(this.range.get("start").value).format('yyyy-MM-DD') + ` to ` + moment(this.range.get("end").value).format('yyyy-MM-DD') + `</div>
  </div>
  <table class="table" style="font-size:12px">
  <thead>
    <tr>
      <th scope="col">Date</th>
      <th scope="col">Remark</th>
      <th scope="col">Amount</th>
      <th scope="col">Balance</th>
    </tr>
  </thead>
  <tbody>
    
    
  `;
    for (const r of this.clientTradeBookData) {
      const trValue = `
      <tr>
      <td>`+ r.date + `</td>
      <td>`+ r.remark + `</td>
      <td>`+ r.amount + `</td>
      <td>`+ r.balance + `</td>
      </tr>
      `;
      html += trValue;
    }
    html += `</tbody>
    </table>
    </div>`;

    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
    WindowPrt.document.write('<body onload="window.print()">' + html + '</body>');
    // WindowPrt.document.write(html);
    WindowPrt.document.close();
    WindowPrt.focus();
    // WindowPrt.print();
    // WindowPrt.close();
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.clientDetails
          .filter(v => v.clientName.toLowerCase().indexOf(term.toLowerCase()) > -1)
          .map(v => v.clientName)
          .slice(0, 10))
    )



}
