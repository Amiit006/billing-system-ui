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

  constructor(private fb: FormBuilder, private reportService: ReportService
    , private dashboardService: DashboardService) { }

  ngOnInit(): void {

  }

  setRangeEmitter(range) {
    this.reportStatus = "loading";
    const from_date = moment(range.get("start").value).format('yyyy-MM-DD');
    const to_date = moment(range.get("end").value).format('yyyy-MM-DD');
    this.dashboardService.getSellStats(from_date, to_date)
      .subscribe(data => {
        // this.single = data.map(datum => ({name: datum.name, value: '₹ ' + datum.value}))
        this.single=data;
      }, error => console.log(error.error.error));
    this.reportService.getSellsReport(from_date, to_date)
      .subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.reportStatus = "loaded";
      });
  }

}
