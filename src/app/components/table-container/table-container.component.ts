import { InvokeFunctionExpr } from '@angular/compiler';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { TableResult } from 'src/app/model/table-result.model';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-table-container',
  templateUrl: './table-container.component.html',
  styleUrls: ['./table-container.component.css']
})
export class TableContainerComponent implements OnInit, AfterViewInit {

  @Input() displayedColumns: string[] = ['paymentId', 'paymentDate', 'clientName', 'amount', 'paymentMode'];
  @Input() displayedColumnsValue: string[] = ['Payment Id', 'Payment Date', 'Client Name', 'Amount', 'Payment Mode'];

  @Input() dataSource1;
  @Input() dataSource = new MatTableDataSource();

  @Output() result = new EventEmitter<TableResult>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource1.subscribe(data => {
      console.log(data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.result.emit({status: "loaded", "tableSize": this.dataSource.data.length});
    });
  }

}
