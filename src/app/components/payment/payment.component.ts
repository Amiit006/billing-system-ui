import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  maxDate = new Date();
  constructor(private fb: FormBuilder) { }
  @Output() paymentFormData = new EventEmitter();
  paymentForm = this.fb.group({
    'paymentDate': [new Date(), Validators.required],
    'paymentAmount': [0, Validators.required],
    'paymentMode': ['cash', Validators.required]
  });

  ngOnInit(): void {
    this.paymentForm.valueChanges.subscribe(() => {
      this.paymentFormData.emit(this.paymentForm);
    })
  }

}
