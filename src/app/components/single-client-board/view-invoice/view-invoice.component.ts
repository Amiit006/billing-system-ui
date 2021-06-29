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
  constructor(private activatedRoute: ActivatedRoute, private clientService: ClientsService, private router: Router) {
    this.clientId = +this.activatedRoute.snapshot.paramMap.get("clientId");
    this.invoiceId = +this.activatedRoute.snapshot.paramMap.get("invoiceId");
    console.log(this.clientId, this.invoiceId);
    this.invoice = this.router.getCurrentNavigation().extras?.state?.invoice;
    if (this.clientId > 0) {
      this.clientService.getClientById(this.clientId).subscribe(data => {
        this.client = data;
      }, error => {
        console.log(error)
      });
    }
    // if(this.invoiceId > 0) {
    //   this.invoiceService.getInvoiceByInvoiceId(this.invoiceId).subscribe(data => {
    //     this.invoice = data;
    //     console.log(data);
    //   }, error => {
    //     console.log(error)
    //   });
    // }
  }

  ngOnInit(): void {
  }

}
