import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChartResponse } from 'src/app/model/chart-response.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ReportService } from 'src/app/services/report.service';
import * as moment from 'moment';

@Component({
  selector: 'app-particulars-report',
  templateUrl: './particulars-report.component.html',
  styleUrls: ['./particulars-report.component.css']
})
export class ParticularsReportComponent implements OnInit {

  displayedColumns: string[] = ['particulars', 'totalSell'];
  displayedColumnsValue: string[] = ['Particulars', 'Total Sell'];

  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  reportStatus = "notloaded";
  showReport = false;
  single: ChartResponse[] = [];

  gradient: boolean = false;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  view: any[] = [1100, 500];
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
    // this.showReport = true;
    const from_date = moment(range.get("start").value).format('yyyy-MM-DD');
    const to_date = moment(range.get("end").value).format('yyyy-MM-DD');
    // this.dashboardService.getCollectionStats(from_date, to_date)
    //   .subscribe(data => {
    //     this.single = data;
    //     this.reportStatus = "loaded";
    //   }, error => console.log(error.error.error));
    this.reportService.getParticularsReport(from_date, to_date).subscribe(data => {
      console.log(data);
      this.single = data.map(datum => ({name: datum.particulars, value: datum.totalSell}))
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.reportStatus = "loaded";
    })
  }

  downloadFile(data: any) {
    // this.downloadService.downloadFile(data, "sells_report_" + moment(new Date()).format('yyyy-MM-DD-hh-mm-ss')+".csv");
    const totalGrandTotalAmount = data.reduce((n, { totalSell }) => n + totalSell, 0);
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    csv.push(['Total', totalGrandTotalAmount])
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], { type: 'text/csv' })
    saveAs(blob, "particulars_report_" + moment(new Date()).format('yyyy-MM-DD-hh-mm-ss') + ".csv");
  }

}
