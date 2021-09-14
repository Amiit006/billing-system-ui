import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OutstandingService } from 'src/app/services/outstanding.service';

@Component({
  selector: 'app-bill-payment',
  templateUrl: './billing-payment.component.html',
  styleUrls: ['./billing-payment.component.css']
})
export class PaymentComponent implements OnInit {
  maxDate = new Date();
  @Input() showOutstandingHtml = false;
  @Input() clientForm: FormGroup;

  outstandingAmount = 0;
  constructor(private fb: FormBuilder, private outstandingService: OutstandingService
    , private toastr: ToastrService) { }

  @Output() paymentFormData = new EventEmitter();

  paymentForm = this.fb.group({
    'paymentDate': [new Date(), Validators.required],
    'paymentAmount': [0, Validators.required],
    'paymentMode': ['cash', Validators.required]
  });

  ngOnInit(): void {
    this.getOutstandingbyId();
    this.paymentFormData.emit(this.paymentForm);
    this.paymentForm.valueChanges.subscribe(() => {
      this.paymentFormData.emit(this.paymentForm);
    })
  }

  getOutstandingbyId() {
    const clientId = this.clientForm?.get("clientId")?.value;
    if(this.showOutstandingHtml && clientId) {
      this.outstandingService.getOutstandingById(clientId)
        .subscribe(data => {
          this.outstandingAmount = data;
        }, error => this.toastr.error("Unable to fetch Client OutStanding"));
    }
  }

  paymentFullClick() {
    this.paymentForm.get("paymentAmount").setValue(this.outstandingAmount);
  }
}
