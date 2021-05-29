import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BillAmountDetails } from 'src/app/model/bill-amount-details.model';

@Component({
  selector: 'app-billing-board',
  templateUrl: './billing-board.component.html',
  styleUrls: ['./billing-board.component.css']
})
export class BillingBoardComponent implements OnInit {
  
  clientForm: FormGroup = this.fb.group({});
  billForm: FormGroup = this.fb.group({});
  paymentForm: FormGroup = this.fb.group({});
  
  billAmountDetails: BillAmountDetails;

  subTotalBillAmount = 0;


  constructor(private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.clientForm.setErrors({'incorrect': true});
    this.billForm.setErrors({'incorrect': true});
    // this.paymentForm.setErrors({'incorrect': true});
  }

  setClientFormData(event: FormGroup) {
    this.clientForm = event;
  }

  setBillFormData(event: FormGroup) {
    this.billForm = event;
  }

  setPaymentFormData(event: FormGroup) {
    console.log(event)
    this.paymentForm = event;
  }

  setSubTotalBillAmount(event) {
    this.subTotalBillAmount = event;
  }

  setBillAmountDetails(event: BillAmountDetails) {
    this.billAmountDetails = event;
  }

  // onPrintBill() {
  //   this.router.navigateByUrl("/invoice", {
  //     state: {
  //       clientForm: this.clientForm,
  //       billFormValue: this.billForm.getRawValue(),
  //       paymentDetails: this.paymentForm,
  //       billAmountDetails: this.billAmountDetails
  //     }
  //   });
  // }

}
