import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/app/model/client.model';
import { BillingService } from 'src/app/services/billing.service';
import { ClientsService } from 'src/app/services/clients.service';

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

  showNext = false;
  showPrev = false;

  constructor(private activatedRoute: ActivatedRoute, private clientService: ClientsService, private router: Router) {
    this.clientId = +this.activatedRoute.snapshot.paramMap.get("clientId");
    this.invoiceId = +this.activatedRoute.snapshot.paramMap.get("invoiceId");
    this.invoices = this.router.getCurrentNavigation().extras?.state?.invoice;
    this.client = this.router.getCurrentNavigation().extras?.state?.client;
    this.invoice = this.invoices.filter(data => data.invoiceId === this.invoiceId)[0];
    this.totalQuantity = this.invoice.invoiceDetails.map(x => x.quanity).reduce((a, b) => a + b, 0);
    // if (this.clientId > 0) {
    //   this.clientService.getClientById(this.clientId).subscribe(data => {
    //     this.client = data;
    //   }, error => {
    //   });
    // }
    const index = this.invoices.findIndex(x => x.invoiceId == this.invoiceId);
    if (index < this.invoices.length - 1) {
      this.showNext = true;
    } else this.showNext = false;
    index == 0 ? this.showPrev = false : this.showPrev = true;
  }

  ngOnInit(): void {
  }

  onNextClick() {
    var index = this.invoices.findIndex(x => x.invoiceId == this.invoiceId);
    if (index != this.invoices.length - 1) {
      const indx = this.invoices[index + 1].invoiceId;
      // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      // this.router.onSameUrlNavigation = 'reload';
      // this.router.navigate(["clients/" + this.clientId + "/invoice/" + indx]
      //   , { state: { invoice: this.invoices, client: this.client } });

      this.router.navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigate(["clients/" + this.clientId + "/invoice/" + indx]
        , { state: { invoice: this.invoices, client: this.client } }));
    }
  }

  onPrevClick() {
    var index = this.invoices.findIndex(x => x.invoiceId == this.invoiceId);
    if (index > -1) {
      const indx = this.invoices[index - 1].invoiceId;
      // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      // this.router.onSameUrlNavigation = 'reload';
      // this.router.navigate(["clients/" + this.clientId + "/invoice/" + indx]
      //   , { state: { invoice: this.invoices, client: this.client } });
      this.router.navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigate(["clients/" + this.clientId + "/invoice/" + indx]
        , { state: { invoice: this.invoices, client: this.client } }));
    }
  }

  onClickReturnToClient() {
    this.router.navigate(["clients/" + this.clientId]);
  }

}
