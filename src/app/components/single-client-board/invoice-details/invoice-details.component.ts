import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/app/model/client.model';
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
  showSpinner = true;
  invoice;
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() createNewBill = new EventEmitter<boolean>();
  @Input() clientData: Client;

  constructor(private billingService: BillingService, private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.clientId = this.activatedRoute.snapshot.paramMap.get("clientId");
    this.billingService.getInvoiceByClientId(this.clientId).subscribe(data => {
      console.log(data);
      this.invoice = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.showSpinner = false;
    });
  }

  onNewBillClick() {
    this.createNewBill.emit(true);
  }

  onViewClick(invoiceId) {
    const clientId = this.activatedRoute.snapshot.paramMap.get("clientId");
    this.router.navigate(["clients/" + clientId + "/invoice/" + invoiceId]
      , { state: { invoice: this.invoice.filter(data => data.invoiceId === invoiceId)[0] } });
  }

}
