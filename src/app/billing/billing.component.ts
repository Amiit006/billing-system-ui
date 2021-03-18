import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {
  panelOpenState = true;
  slNoCount=0;

  subTotalBillAmount: number;

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
      'amount': [],
      'quanity': [],
      'total': [{ value: 0, disabled: true }]
    });
  };

  addRow() {
    (<FormArray>this.billForm.get("items")).push(
      this.addbillFormGroup()
    );
    console.log((<FormArray>this.billForm.get('items')).controls);
  }

  removeRow(index) {
    (<FormArray>this.billForm.get("items")).removeAt(index)
    this.billForm.get("items");
    if(index !== this.slNoCount) {
      this.reassignSlNo();
    }
  }

  reassignSlNo() {
    let value = 1;
    (<FormArray>this.billForm.get("items")).controls.map(x => {
      // x.get('slNo').value = value;
      x.get("slNo").setValue(value);
      value += 1;
    });
    this.slNoCount = value-1;
  }

  ngOnInit(): void {
    setInterval(() => {

    }, 2000);
  }

  onAmountChange(i) {
    this.calculateAndPopulateTotal(i);
  }
  
  onQntyChange(i) {
    this.calculateAndPopulateTotal(i);
  }

  calculateAndPopulateTotal(index) {
    const amount = this.billForm.get("items").value[index]["amount"];
    const quanity = this.billForm.get("items").value[index]["quanity"];   
    (<FormArray>this.billForm.get("items")).controls[index].get("total").setValue(amount * quanity);
    this.calculateSubtotalBillAmount();
  }

  calculateSubtotalBillAmount() {
    let subTotal = 0;
    (<FormArray>this.billForm.get("items")).controls.map(x=> {
      subTotal += x.get('total').value;
    });
    this.subTotalBillAmount = subTotal;
  }

}
