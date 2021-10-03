import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ChartResponse } from 'src/app/model/chart-response.model';
import { TableResult } from 'src/app/model/table-result.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-collection-report',
  templateUrl: './collection-report.component.html',
  styleUrls: ['./collection-report.component.css']
})
export class CollectionReportComponent implements OnInit {

  displayedColumns: string[] = ['paymentId', 'paymentDate', 'clientName', 'amount', 'paymentMode'];
  displayedColumnsValue: string[] = ['Payment Id', 'Payment Date', 'Client Name', 'Amount', 'Payment Mode'];

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
    // this.showReport = true;
    const from_date = moment(range.get("start").value).format('yyyy-MM-DD');
    const to_date = moment(range.get("end").value).format('yyyy-MM-DD');
    this.dashboardService.getCollectionStats(from_date, to_date)
      .subscribe(data => {
        this.single = data;
        this.reportStatus = "loaded";
      }, error => console.log(error.error.error));
    this.reportService.getCollectionStats(from_date, to_date).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  getData() {
    console.log("called");
    const from_date = moment(this.range.get("start").value).format('yyyy-MM-DD');
    const to_date = moment(this.range.get("end").value).format('yyyy-MM-DD');
    return this.reportService.getCollectionStats(from_date, to_date);
  }
  result: TableResult = null;
  setResult(event) {
    this.result = event;
    console.log(event);
  }

}
