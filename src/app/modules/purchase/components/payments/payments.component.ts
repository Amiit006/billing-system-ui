import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import * as moment from 'moment';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  maxDate = new Date();
  paymentModes = [
    { 'viewValue': 'Cash', 'value': 'cash' },
    { 'viewValue': 'Bank Transfer', 'value': 'bankTransfer' },
    { 'viewValue': 'Cheque', 'value': 'cheque' }
  ]

  paymentForm = this.fb.group({
    'amount': [0, [Validators.required, Validators.min(1)]],
    'paymentDate': [new Date(), Validators.required],
    'mode': ['cash', Validators.required],
    'chequeNo': [''],
    'remark': ['', Validators.required]
  });

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
    private paymentService: PaymentService, public dialogRef: MatDialogRef<PaymentsComponent>) { }

  ngOnInit(): void {
    this.paymentForm.get("chequeNo").disable();
  }

  onChange(value) {
    if (value === 'cheque') {
      this.paymentForm.get("chequeNo").enable();
      this.paymentForm.get("chequeNo").setValidators([Validators.required, Validators.min(1)]);
      this.paymentForm.get("chequeNo").setErrors({ 'invalid': true });
    } else {
      this.paymentForm.get("chequeNo").setValue('');
      this.paymentForm.get("chequeNo").disable();
      this.paymentForm.get("chequeNo").clearValidators();
    }
  }

  onSave() {
    console.log('seasonId', this.data.seasonId);
    console.log('purchaseId', this.data.purchaseId)
    console.log(this.paymentForm.getRawValue());
    const payment = {
      "mode": this.paymentForm.get("mode").value,
      "chequeNo": this.paymentForm.get("chequeNo").value,
      "paymentDate": moment(this.paymentForm.get("paymentDate").value).format('yyyy-MM-DD'),
      "remark": this.paymentForm.get("remark").value,
      "amount": this.paymentForm.get("amount").value
    }
    this.paymentService.createPayment(this.data.seasonId, this.data.purchaseId, payment).subscribe(data => {
      const result = {
        "success": true,
        "response": "Successfully created payment!"
      }
      this.dialogRef.close(result);
    }, error => {
      console.log(error);
    });
  }

}
