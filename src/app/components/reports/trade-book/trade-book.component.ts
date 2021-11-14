import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ChartResponse } from 'src/app/model/chart-response.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-trade-book',
  templateUrl: './trade-book.component.html',
  styleUrls: ['./trade-book.component.css']
})
export class TradeBookComponent implements OnInit {

  displayedColumns: string[] = ['billPaymentDate', 'clientName', 'amount', 'transactionType'];
  displayedColumnsValue: string[] = ['billPaymentDate', 'clientName', 'amount', 'transactionType'];

  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  reportStatus = "notloaded";
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

  }
  range;
  setRangeEmitter(range) {
      this.range = range;
    this.reportStatus = "loading";
    const from_date = moment(range.get("start").value).format('yyyy-MM-DD');
    const to_date = moment(range.get("end").value).format('yyyy-MM-DD');
    this.dashboardService.getCollectionStats(from_date, to_date)
      .subscribe(data => {
        this.single = data;
        this.reportStatus = "loaded";
      }, error => {
        console.log(error.error.error);
        this.reportStatus = "error";
      });
    this.reportService.getTradeBookReport(from_date, to_date).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.reportStatus = "loaded";
    }, error => {
      this.dataSource = new MatTableDataSource();
      console.log(error.error.error);
      this.reportStatus = "error";
    });
  }

  downloadFile(data: any) {
    // this.downloadService.downloadFile(data, "sells_report_" + moment(new Date()).format('yyyy-MM-DD-hh-mm-ss')+".csv");
    console.log(data);
    const totalGrandTotalAmount = data.reduce((n, { amount }) => n + amount, 0);

    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    csv.push(['', '', 'Total', totalGrandTotalAmount])
    console.log(csv);
    let csvArray = csv.join('\r\n');
    console.log(csvArray);
    var blob = new Blob([csvArray], { type: 'text/csv' })
    saveAs(blob, "sells_report_" + moment(new Date()).format('yyyy-MM-DD-hh-mm-ss') + ".csv");
  }

}
