import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportService } from 'src/app/services/report.service';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ChartResponse } from 'src/app/model/chart-response.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver';
import { DownloadService } from 'src/app/services/download.service';
import { Router } from '@angular/router';
import { BillingService } from 'src/app/services/billing.service';
import { ClientsService } from 'src/app/services/clients.service';
@Component({
  selector: 'app-sells-report',
  templateUrl: './sells-report.component.html',
  styleUrls: ['./sells-report.component.css']
})
export class SellsReportComponent implements OnInit {

  //https://www.qupaya.com/blog/date-range-picker-custom-ranges
  displayedColumns: string[] = ['invoiceId', 'invoiceDate', 'clientName', 'subTotalAmount', 'discountAmount', 'grandTotalAmount'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  reportStatus = "notloaded";

  single: ChartResponse[] = [];
  view: any[] = [1100, 200];
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  cardColor: string = '#232837';
  sellData: Observable<ChartResponse[]>;
  constructor(private fb: FormBuilder, private reportService: ReportService
    , private dashboardService: DashboardService, private downloadService: DownloadService
    , private router: Router, private billingService: BillingService
    , private clientsService: ClientsService) { }

  ngOnInit(): void {
    this.sellData = this.dashboardService.getSellForOneYearByDayReport();
    if(sessionStorage.getItem('sell_report_from_date') && sessionStorage.getItem('sell_report_to_date')) {
      let sellData = JSON.parse(sessionStorage.getItem('sell_data'));
      let sell_stats = JSON.parse(sessionStorage.getItem('sell_stats'));
      this.dataSource = new MatTableDataSource(sellData);
      this.single = sell_stats;
      this.reportStatus = "loaded";
    }
  }
  from_date; 
  to_date;
  setRangeEmitter(range) {
    this.reportStatus = "loading";
    this.from_date = moment(range.get("start").value).format('yyyy-MM-DD');
    this.to_date = moment(range.get("end").value).format('yyyy-MM-DD');
    sessionStorage.setItem("sell_report_from_date", this.from_date);
    sessionStorage.setItem("sell_report_to_date", this.to_date);
    this.dashboardService.getSellStats(this.from_date, this.to_date)
      .subscribe(data => {
        this.single = data;
        sessionStorage.setItem("sell_stats", JSON.stringify(data));
      }, error => console.log(error.error.error));
    this.reportService.getSellsReport(this.from_date, this.to_date)
      .subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        sessionStorage.setItem("sell_data", JSON.stringify(data));
        this.reportStatus = "loaded";
      });
  }

  invoice = [];
  clientData;
  viewInvoice(element) {
    this.billingService.getInvoiceByClientId(element.clientId).subscribe(data => {
      this.invoice = data.data;
      this.clientsService.getClientById(element.clientId).subscribe(data => {
        this.clientData = data;
        this.router.navigate(["clients/" + element.clientId + "/invoice/" + element.invoiceId]
      , { state: { invoice: this.invoice , client: this.clientData} });
      });
    });
  }

  downloadFile(data: any) {
    // this.downloadService.downloadFile(data, "sells_report_" + moment(new Date()).format('yyyy-MM-DD-hh-mm-ss')+".csv");
    console.log(data);
    const totalSubAmount = data.reduce((n, { subTotalAmount }) => n + subTotalAmount, 0);
    const totalDiscountAmount = data.reduce((n, { discountAmount }) => n + discountAmount, 0);
    const totalGrandTotalAmount = data.reduce((n, { grandTotalAmount }) => n + grandTotalAmount, 0);
    const totalTaxAmount = data.reduce((n, { taxAmount }) => n + taxAmount, 0);

    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    csv.push(['', '', '', '', 'Total', totalSubAmount, totalTaxAmount, totalDiscountAmount, totalGrandTotalAmount])
    console.log(csv);
    let csvArray = csv.join('\r\n');
    console.log(csvArray);
    var blob = new Blob([csvArray], { type: 'text/csv' })
    saveAs(blob, "sells_report_" + moment(new Date()).format('yyyy-MM-DD-hh-mm-ss') + ".csv");
  }
}
