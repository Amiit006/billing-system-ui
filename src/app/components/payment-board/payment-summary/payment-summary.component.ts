// payment-summary.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.css'],
})
export class PaymentSummaryComponent implements OnInit {
  mode = 'indeterminate';
  displayProgressSpinner = false;
  paymentSaveStatus = false;
  paymentId = 0;

  @Input() clientForm: FormGroup;
  @Input() paymentForm: FormGroup;
  @Output() paymentSaveStatusEmitter = new EventEmitter<boolean>();

  constructor(
    private toastrService: ToastrService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.paymentService
      .generatePaymentId()
      .subscribe((data) => (this.paymentId = data));
  }

  onSave() {
    const value = {
      client: this.clientForm.getRawValue(),
      payment: this.paymentForm.getRawValue(),
    };
    this.displayProgressSpinner = true;
    value.payment.paymentId = this.paymentId;
    this.paymentService.createPayment(value).subscribe(
      (data) => {
        this.displayProgressSpinner = false;
        this.paymentSaveStatus = true;
        this.paymentSaveStatusEmitter.emit(this.paymentSaveStatus);
        this.toastrService.success(data.response);
      },
      (error) => {
        this.displayProgressSpinner = false;
        this.toastrService.error(error.error.error);
      }
    );
  }

  onShareWhatsApp() {
    const clientData = this.clientForm.getRawValue();
    const paymentData = this.paymentForm.getRawValue();

    // Get phone number (remove any non-digit characters and add country code if needed)
    let phoneNumber = clientData.mobile?.toString().replace(/\D/g, '');

    // Add country code if not present (assuming India +91)
    if (
      phoneNumber &&
      !phoneNumber.startsWith('91') &&
      phoneNumber.length === 10
    ) {
      phoneNumber = '91' + phoneNumber;
    }

    if (!phoneNumber) {
      this.toastrService.error('Phone number not found for this client');
      return;
    }

    // Create payment summary message
    const paymentDate = new Date(paymentData.paymentDate).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }
    );

    const message = `
          *PAYMENT RECEIPT*
          *Radharani Dresses*
          Payment ID: #${this.paymentId}
          *Payment Done By:*
          ${clientData.clientName}
          ${clientData.address?.storeName || ''}
          Phone: ${clientData.mobile}

          *Payment Summary:*
          Date: ${paymentDate}
          Amount: ₹${paymentData.paymentAmount}
          Mode: ${paymentData.paymentMode}

          *Thank you for your payment!*`;

              // Create WhatsApp URL
              const whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
                message
              )}`;

              // Open WhatsApp Web in new tab
              window.open(whatsappUrl, '_blank');
  }
}
