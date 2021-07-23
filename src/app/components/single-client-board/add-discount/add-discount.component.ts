import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BillingService } from 'src/app/services/billing.service';


@Component({
  selector: 'app-add-discount',
  templateUrl: './add-discount.component.html',
  styleUrls: ['./add-discount.component.css']
})
export class AddDiscountComponent implements OnInit {
  @Output() billSettingFormData = new EventEmitter();
  billAmountDetails;
  billSettingForm = this.fb.group({
    'isGstBill': [false, Validators.required],
    'taxPercentage': [0, Validators.required],
    'overallDiscountPercentage': [0, Validators.required]
  });
  
  billSettingFormValueChanged = false;
  tempBillSettingForm = this.billSettingForm.getRawValue();

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddDiscountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private billingService: BillingService,
    private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    if(this.data.invoiceDetails.taxPercentage && this.data.invoiceDetails.taxPercentage > 0) {
      this.billSettingForm.get("taxPercentage").setValue(this.data.invoiceDetails.taxPercentage);
      this.billSettingForm.get("taxPercentage").enable();
      this.tempBillSettingForm = this.billSettingForm.getRawValue();
    } else {
      this.billSettingForm.get("taxPercentage").disable();
    }
    if(this.data.invoiceDetails.discountPercentage && this.data.invoiceDetails.discountPercentage > 0) {
      this.billSettingForm.get("overallDiscountPercentage").setValue(this.data.invoiceDetails.discountPercentage);
      this.tempBillSettingForm = this.billSettingForm.getRawValue();
    }
    this.billSettingFormData.emit(this.billSettingForm);
    this.billSettingForm.valueChanges.subscribe(() => {
      if(this.tempBillSettingForm.taxPercentage !== this.billSettingForm.get("taxPercentage").value
        || this.tempBillSettingForm.overallDiscountPercentage !== this.billSettingForm.get("overallDiscountPercentage").value)
        this.billSettingFormValueChanged = true; 
      else 
        this.billSettingFormValueChanged = false; 
      this.billSettingFormData.emit(this.billSettingForm);
    });
  }

  gstSelectedEvent(event: MatCheckboxChange) {
    if (!event.checked) {
      this.billSettingForm.get("taxPercentage").disable();
      this.billSettingForm.get("taxPercentage").setValue(0);
    } else {
      this.billSettingForm.get("taxPercentage").enable();
    }
  }

  onSave() {
    this.billingService.addDiscountToBill(this.data.invoiceDetails.clientId, this.data.invoiceDetails.invoiceId, this.billingService.getBillAmountDetails())
      .subscribe(data => {
        const result = {
          "success": true,
          "response": data
        }
        this.dialogRef.close(result);
      }, error => {
        this.toastrService.error(error.error.error);
      });
    
  }

}
