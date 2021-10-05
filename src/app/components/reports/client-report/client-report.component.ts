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
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  //Sell Details: 
  sellDisplayedColumns: string[] = ['invoiceId', 'invoiceDate', 'clientName', 'subTotalAmount', 'discountAmount', 'grandTotalAmount'];
  sellDisplayedColumnsValue: string[] = ['Invoice Id', 'Invoice Date', 'Client Name', 'SubTotalAmount', 'DiscountAmount', 'GrandTotalAmount'];
  sellDataSource = new MatTableDataSource();
  @ViewChild(MatSort) sellSort: MatSort;
  @ViewChild(MatPaginator) sellPaginator: MatPaginator;

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
      }, error => console.log(error.error.error));
    this.reportService.getClientReport(from_date, to_date, clientId).subscribe(data => {
      this.collectionDataSource = new MatTableDataSource(data.clientCollection);
      this.collectionDataSource.sort = this.sort;
      this.collectionDataSource.paginator = this.paginator;

      this.sellDataSource = new MatTableDataSource(data.clientSell);
      this.sellDataSource.sort = this.sort;
      this.sellDataSource.paginator = this.paginator;
      this.reportStatus = "loaded";
    })
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
