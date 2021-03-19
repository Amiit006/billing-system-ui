import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  paymentForm = this.fb.group({
    'date': [{ value: new Date(), required: true }],
    'amount': [{ value: 0, required: true }],
    'mode': [{ value: 'cash', required: true }]
  });

  ngOnInit(): void {
  }

}
