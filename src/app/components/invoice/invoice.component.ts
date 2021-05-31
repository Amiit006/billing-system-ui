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

  @Input() clientForm: FormGroup;
  @Input() billForm: FormGroup;
  @Input() paymentForm: FormGroup;
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
      console.log(data);
      this.invoiceId = data;
    })
    console.log('clientForm', this.clientForm);
    console.log('billForm', this.billForm);
    console.log('paymentForm', this.paymentForm);
    console.log('billAmountDetails', this.billAmountDetails);
  }

  onSave() {
    const value = {
      "invoice": this.billForm.getRawValue().items,
      "client": this.clientForm.getRawValue(),
      "payment": this.paymentForm.getRawValue(),
      "billAmountDetails": this.billAmountDetails
    }
    console.log(value);
    this.displayProgressSpinner = true;
    this.billingService.createInvoice(value).subscribe(data => {
      this.displayProgressSpinner = false;
      this.invoiceSaveStatus = true;
      this.invoiceSaveStatusEmitter.emit(this.invoiceSaveStatus);
      this.toastrService.success(data.response);
    });
  }

}
