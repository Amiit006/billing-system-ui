// Updated view-invoice.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Client } from 'src/app/model/client.model';
import { BillingService } from 'src/app/services/billing.service';
import { ClientsService } from 'src/app/services/clients.service';
import { AddDiscountComponent } from '../add-discount/add-discount.component';
import { ProfitInsightsComponent } from './profit-insights/profit-insights.component';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.css']
})
export class ViewInvoiceComponent implements OnInit {
  mode = 'indeterminate';
  displayProgressSpinner = false;
  clientId = 0;
  invoiceId = 0;
  client: Client;
  invoice: any;
  invoices: any = [];
  totalQuantity: number = 0;
  roundOffAmount: number = 0;
  showNext = false;
  showPrev = false;

  constructor(private activatedRoute: ActivatedRoute, public dialog: MatDialog, 
    private clientService: ClientsService, private router: Router, private billingService: BillingService,
    private toastrService: ToastrService) {
    this.clientId = +this.activatedRoute.snapshot.paramMap.get("clientId");
    this.invoiceId = +this.activatedRoute.snapshot.paramMap.get("invoiceId");
    this.invoices = this.router.getCurrentNavigation().extras?.state?.invoice;
    this.client = this.router.getCurrentNavigation().extras?.state?.client;
    this.invoice = this.invoices.filter(data => data.invoiceId === this.invoiceId)[0];
    this.totalQuantity = this.invoice.invoiceDetails.map(x => x.quanity).reduce((a, b) => a + b, 0);
    this.roundOffAmount = this.invoice.grandTotalAmount - (this.invoice.subTotalAmount + this.invoice.taxAmount);
    const index = this.invoices.findIndex(x => x.invoiceId == this.invoiceId);
    if (index < this.invoices.length - 1) {
      this.showNext = true;
    } else this.showNext = false;
    index == 0 ? this.showPrev = false : this.showPrev = true;
  }

  ngOnInit(): void {
  }

  // Check if profit summary is available for this invoice
  hasProfitSummary(): boolean {
    return this.invoice?.profitSummary && Object.keys(this.invoice.profitSummary).length > 0;
  }

  onNextClick() {
    var index = this.invoices.findIndex(x => x.invoiceId == this.invoiceId);
    if (index != this.invoices.length - 1) {
      const indx = this.invoices[index + 1].invoiceId;
      this.router.navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigate(["clients/" + this.clientId + "/invoice/" + indx]
        , { state: { invoice: this.invoices, client: this.client } }));
    }
  }

  onPrevClick() {
    var index = this.invoices.findIndex(x => x.invoiceId == this.invoiceId);
    if (index > -1) {
      const indx = this.invoices[index - 1].invoiceId;
      this.router.navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigate(["clients/" + this.clientId + "/invoice/" + indx]
        , { state: { invoice: this.invoices, client: this.client } }));
    }
  }

  onClickReturnToClient() {
    this.router.navigate(["clients/" + this.clientId]);
  }

  onAddDiscountClick(invoiceId) {
    const data = this.invoices.filter(x => x.invoiceId === invoiceId);
    this.openDialog(invoiceId, data[0]);
  }

  // New method for opening profit insights dialog
  onProfitInsightsClick() {
    this.openProfitInsightsDialog();
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
      }
    });
  }

  // New method for profit insights dialog
  openProfitInsightsDialog(): void {
    const dialogRef = this.dialog.open(ProfitInsightsComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: {
        profitSummary: this.invoice.profitSummary,
        profitRecords: this.invoice.profitRecords,
        invoiceDetails: this.invoice.invoiceDetails,
        invoiceId: this.invoice.invoiceId,
        clientName: this.client?.clientName
      }
    });

    // No need to handle result since it's read-only
    dialogRef.afterClosed().subscribe(result => {
      // Optional: Handle any actions if needed in future
    });
  }

  loadClientBill() {
    this.billingService.getInvoiceByClientId(this.clientId).subscribe(data => {
      this.invoices = data.data;
      this.router.navigateByUrl('/' , { skipLocationChange: true })
        .then(() => this.router.navigate(["clients/" + this.clientId + "/invoice/" + this.invoiceId]
        , { state: { invoice: this.invoices, client: this.client } }));
    });
  }
}