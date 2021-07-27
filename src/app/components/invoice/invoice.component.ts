import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BillAmountDetails } from 'src/app/model/bill-amount-details.model';
import { BillingService } from 'src/app/services/billing.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  mode = 'indeterminate';
  displayProgressSpinner = false;
  
  state$: Observable<any>;

  currentDate = new Date();

  @Input() clientForm;
  @Input() billForm;
  @Input() paymentForm;
  @Input() billAmountDetails: BillAmountDetails;
  @Output() invoiceSaveStatusEmitter = new EventEmitter<boolean>();
  invoiceId: number;
  invoiceSaveStatus = false;
  constructor(public activatedRoute: ActivatedRoute, private billingService: BillingService
    , private toastrService: ToastrService) { }

  ngOnInit(): void {
    
    // this.state$ = this.activatedRoute.paramMap
    //   .pipe(map(() => window.history.state))
    // this.state$.subscribe(data => {
    //   this.clientForm = data.clientForm;
    //   this.billFormData = data.billFormValue.items;
    //   this.billAmountDetails = data.billAmountDetails;
    //   this.paymentDetails = data.paymentDetails;
    // });
    this.billingService.generateInvoiceId().subscribe(data => {
      this.invoiceId = data;
    })
  }

  onSave() {
    const payload = {
      "invoice": this.billForm.items,
      "client": this.clientForm,
      "payment": this.paymentForm,
      "billAmountDetails": this.billAmountDetails
    }
    this.displayProgressSpinner = true;
    this.billingService.createInvoice(payload).subscribe(data => {
      this.displayProgressSpinner = false;
      this.invoiceSaveStatus = true;
      this.invoiceSaveStatusEmitter.emit(this.invoiceSaveStatus);
      this.toastrService.success(data.response);
    }, error => {
      this.displayProgressSpinner = false;
      this.invoiceSaveStatus = false;
      this.invoiceSaveStatusEmitter.emit(this.invoiceSaveStatus);
      this.toastrService.error(error.error.error);
    });
  }

}
