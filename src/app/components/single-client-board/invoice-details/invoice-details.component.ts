import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Client } from 'src/app/model/client.model';
import { BillingService } from 'src/app/services/billing.service';
import { SharedService } from 'src/app/services/shared.service';
import { AddDiscountComponent } from '../add-discount/add-discount.component';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.css']
})
export class InvoiceDetailsComponent implements OnInit {
  clientId;
  displayedColumns: string[] = ['invoiceDate', 'subTotalAmount', 'taxAmount', 'discountAmount', 'payment', 'grandTotalAmount', 'action'];
  dataSource = new MatTableDataSource();
  showSpinner = true;
  invoice;
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() createNewBill = new EventEmitter<boolean>();
  @Input() clientData: Client;

  constructor(private billingService: BillingService, private activatedRoute: ActivatedRoute,
    private router: Router, public dialog: MatDialog, private toastrService: ToastrService,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.clientId = this.activatedRoute.snapshot.paramMap.get("clientId");
    this.loadClientBill();
  }

  loadClientBill() {
    this.billingService.getInvoiceByClientId(this.clientId).subscribe(data => {
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
      // , { state: { invoice: this.invoice.filter(data => data.invoiceId === invoiceId)[0] } });
      , { state: { invoice: this.invoice , client: this.clientData} });
  }

  onAddDiscountClick(invoiceId) {
    const clientId = this.activatedRoute.snapshot.paramMap.get("clientId");
    const data = this.invoice.filter(x => x.invoiceId === invoiceId);
    this.openDialog(invoiceId, data[0]);
  }

  openDialog(invoiceId, data): void {
    const dialogRef = this.dialog.open(AddDiscountComponent, {
      width: '1150px',
      data: {invoiceDetails: data}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result?.success) {
        this.toastrService.success(result.response.response);
        this.loadClientBill();
        this.refreshClientOutstanding(true);
      }
    });
  }

  getGrandTotalAmount(invoice) {
    const rawTotal = 
                (invoice.subTotalAmount ?? 0) -
                (invoice.overallDiscountAmount ?? 0) +
                (invoice.taxAmount ?? 0) -
                (invoice.payment?.amount ?? 0);
    const decimalPart = rawTotal % 1;
    const roundedTotal = decimalPart < 0
        ? 0
        : Math.floor(rawTotal);
    return roundedTotal;
  }

  refreshClientOutstanding(load: boolean) {
    if(load) {
      this.sharedService.reloadClientOutstanding(true);
    }
  }

}
