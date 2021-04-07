import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BillAmountDetails } from 'src/app/model/bill-amount-details.model';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  state$: Observable<any>;
  
  currentDate = new Date();

  billFormData;
  billAmountDetails: BillAmountDetails;
  paymentDetails;

  constructor(public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.state$ = this.activatedRoute.paramMap
      .pipe(map(() => window.history.state))
    this.state$.subscribe(data => {
      this.billFormData = data.billFormValue.items;
      this.billAmountDetails = data.billAmountDetails;
      this.paymentDetails = data.paymentDetails;
    });
  }

}
