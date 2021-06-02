import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-board',
  templateUrl: './payment-board.component.html',
  styleUrls: ['./payment-board.component.css']
})
export class PaymentBoardComponent implements OnInit {
  clientForm: FormGroup = this.fb.group({});
  paymentForm: FormGroup = this.fb.group({});
  showNewPayment = false;
  
  constructor(private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.clientForm.setErrors({ 'incorrect': true });
    this.paymentForm.setErrors({ 'incorrect': true });
  }

  setClientFormData(event: FormGroup) {
    this.clientForm = event;
  }

  setPaymentFormData(event: FormGroup) {
    this.paymentForm = event;
  }

  setShowNewPayment = (event: boolean) => {
    console.log(event);
    this.showNewPayment = event;
  } 

  setPaymentSaveStatusEmitter(event) {
    this.showNewPayment = event;
  }

  onReset() {
    this.router.navigateByUrl('/new-payment-refersh', { skipLocationChange: true }).then(() => {
      this.router.navigate(['new-payment']);
    });
  }

}
