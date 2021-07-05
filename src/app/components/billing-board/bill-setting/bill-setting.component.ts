import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-bill-setting',
  templateUrl: './bill-setting.component.html',
  styleUrls: ['./bill-setting.component.css']
})
export class BillSettingComponent implements OnInit {

  @Output() billSettingFormData = new EventEmitter();

  constructor(private fb: FormBuilder) { }

  billSettingForm = this.fb.group({
    'isGstBill': [false, Validators.required],
    'taxPercentage': [0, Validators.required],
    'overallDiscountPercentage': [0, Validators.required]
  });

  ngOnInit(): void {
    this.billSettingForm.get("taxPercentage").disable();
    this.billSettingFormData.emit(this.billSettingForm);
    this.billSettingForm.valueChanges.subscribe(() => this.billSettingFormData.emit(this.billSettingForm));
  }

  gstSelectedEvent(event: MatCheckboxChange) {
    console.log(event.checked);
    if(!event.checked) {
      this.billSettingForm.get("taxPercentage").disable();
      this.billSettingForm.get("taxPercentage").setValue(0);
    } else {
      this.billSettingForm.get("taxPercentage").enable();
    }
  }

}
