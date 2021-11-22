import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ChartResponse } from 'src/app/model/chart-response.model';
import { TableResult } from 'src/app/model/table-result.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-client-outstanding-report',
  templateUrl: './client-outstanding-report.component.html',
  styleUrls: ['./client-outstanding-report.component.css']
})
export class ClientOutstandingReportComponent implements OnInit {

  displayedColumns: string[] = ['slNo', 'clientName', 'purchasedAmount', 'paymentAmount', 'outstandingAmount'];
  displayedColumnsValue: string[] = ['slNo', 'clientName', 'purchasedAmount', 'paymentAmount', 'outstandingAmount'];

  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  reportStatus = "loading";
  showReport = false;
  single: ChartResponse[] = [];
  view: any[] = [1100, 200];
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  cardColor: string = '#232837';

  constructor(private fb: FormBuilder, private reportService: ReportService
    , private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.getData();
  }


  getData() {
    return this.reportService.getClientOutstandingReport().subscribe(data => {
      console.log(data);
      this.dataSource = new MatTableDataSource(data.clientOutstandingAmount);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.single = data.clientOutstandingAmountSummary;
      this.reportStatus = "loaded";
    });
  }

  downloadFile(data: any) {
    // this.downloadService.downloadFile(data, "sells_report_" + moment(new Date()).format('yyyy-MM-DD-hh-mm-ss')+".csv");
    const totalGrandTotalAmount = data.reduce((n, { amount }) => n + amount, 0);
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    // csv.push(['', '', '', 'Total', totalGrandTotalAmount])
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], { type: 'text/csv' })
    saveAs(blob, "collection_report_" + moment(new Date()).format('yyyy-MM-DD-hh-mm-ss') + ".csv");
  }

}
