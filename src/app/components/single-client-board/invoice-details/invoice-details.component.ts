import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { BillingService } from 'src/app/services/billing.service';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.css']
})
export class InvoiceDetailsComponent implements OnInit {
  clientId;
  displayedColumns: string[] = ['invoiceDate', 'grandTotalAmount', 'subTotalAmount', 'taxAmount', 'payment', 'action'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private billingService: BillingService, private activatedRoute: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.clientId = this.activatedRoute.snapshot.paramMap.get("clientId");
    this.billingService.getInvoiceByClientId(this.clientId).subscribe(data => {
      console.log(data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

}
