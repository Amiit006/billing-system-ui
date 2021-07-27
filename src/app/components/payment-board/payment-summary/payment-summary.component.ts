import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.css']
})
export class PaymentSummaryComponent implements OnInit {
  mode = 'indeterminate';
  displayProgressSpinner = false;
  paymentSaveStatus = false;
  paymentId = 0;
  
  @Input() clientForm: FormGroup;
  @Input() paymentForm: FormGroup;
  @Output() paymentSaveStatusEmitter = new EventEmitter<boolean>();

  constructor(private toastrService: ToastrService, private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.paymentService.generatePaymentId().subscribe(data => this.paymentId = data);
  }

  onSave() {
    const value = {
      "client": this.clientForm.getRawValue(),
      "payment": this.paymentForm.getRawValue(),
    }
    this.displayProgressSpinner = true;
    this.paymentService.createPayment(value).subscribe(data => {
      this.displayProgressSpinner = false;
      this.paymentSaveStatus = true;
      this.paymentSaveStatusEmitter.emit(this.paymentSaveStatus);
      this.toastrService.success(data.response);
    }, error => {
      this.displayProgressSpinner = false;
      this.toastrService.error(error.error.error);
    });
  }

}
