import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {
  panelOpenState = true;
  slNoCount=0;
  constructor(private fb: FormBuilder) {

  }

  billForm = this.fb.group({
    items: this.fb.array([this.addbillFormGroup()])
  })
  
  
  
  addbillFormGroup() {
    this.slNoCount += 1;
    return this.fb.group({
      'slNo': [{ value: this.slNoCount, disabled: true }],
      'perticularts': [''],
      'amount': [0],
      'quanity': [0],
      'total': [{ value: 0, disabled: true }]
    });
  };

  addRow() {
    (<FormArray>this.billForm.get("items")).push(
      this.addbillFormGroup()
    );
  }

  removeRow(index) {
    this.billForm.get("items").removeAt(index);
    if(index !== this.slNoCount) {
      this.reassignSlNo();
    }
  }

  reassignSlNo() {
    let value = 1;
    this.billForm.get('items').controls.map(x => {
      // x.get('slNo').value = value;
      x.controls.slNo.value = value;
      value += 1;
    });
  }

  ngOnInit(): void {
    setInterval(() => {

    }, 2000);
  }


}
