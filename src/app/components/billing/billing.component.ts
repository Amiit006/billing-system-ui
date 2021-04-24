import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BillAmountDetails } from 'src/app/model/bill-amount-details.model';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {
  panelOpenState = true;
  slNoCount = 0;

  subTotalBillAmount: number;

  noOfPerticulars = 0;

  billAmountDetails: BillAmountDetails;
  paymentDetails;

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private router: Router) { }

  billForm = this.fb.group({
    items: this.fb.array([this.addbillFormGroup()])
  })

  addbillFormGroup() {
    this.slNoCount += 1;
    return this.fb.group({
      'slNo': [{ value: this.slNoCount, disabled: true }],
      'perticulars': ['', Validators.required],
      'amount': [0, [Validators.required, Validators.min(1)]],
      'quanity': [0, [Validators.required, Validators.min(1)]],
      'total': [{ value: 0, disabled: true }],
      'verified': [false, Validators.required]
    });
  };

  addRow() {
    (<FormArray>this.billForm.get("items")).push(
      this.addbillFormGroup()
    );
  }

  removeRow(index) {
    const billFrm = (<FormArray>this.billForm.get("items"));
    if (billFrm.length == 1) {
      this.openSnakbar("Must have aleast one row", "Close");
    }
    else if (billFrm.length > 1) {
      const test1 = billFrm.at(index);
      billFrm.removeAt(index);
      this.noOfPerticulars = billFrm.length;
      console.log(this.noOfPerticulars);
      if (index !== this.slNoCount) {
        this.reassignSlNo();
      }
      // // Undo action
      // var test = this._snackBar.open("Row deleted", "undo", {
      //   duration: 3000
      // });
      // test.afterDismissed().subscribe(data => {
      //   // undo clicked
      //   if (data.dismissedByAction) {
      //     // this.addRow();
      //     (<FormArray>this.billForm.get("items")).insert(index, test1);
      //     this.reassignSlNo();
      //     this.noOfPerticulars = billFrm.length;
      //     console.log(this.noOfPerticulars);
      //   }
      // });
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === 'F4') {
      if (this.billForm.valid)
        this.addRow();
      else 
        this.openSnakbar("Fill the form first", "Close")
    }
  }

  reassignSlNo() {
    let value = 1;
    (<FormArray>this.billForm.get("items")).controls.map(x => {
      // x.get('slNo').value = value;
      x.get("slNo").setValue(value);
      value += 1;
    });
    this.slNoCount = value - 1;
  }

  ngOnInit(): void {

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
    (<FormArray>this.billForm.get("items")).controls.map(x => {
      subTotal += x.get('total').value;
    });
    this.subTotalBillAmount = subTotal;
  }

  openSnakbar(msg, action) {
    this._snackBar.open(msg, action, {
      duration: 2000
    });
  }

  onPrintBill() {
    this.router.navigateByUrl("/invoice", {
      state: {
        billFormValue: this.billForm.getRawValue(),
        billAmountDetails: this.billAmountDetails,
        paymentDetails: this.paymentDetails
      }
    });
  }

  // trackByFn(index: any, item: any) {
  //   return index;
  // }

  verifyRow(index, event: MatCheckboxChange) {
    if (event.checked) {
      const perticulars = this.billForm.get("items").value[index]["perticulars"];
      const amount = this.billForm.get("items").value[index]["amount"];
      const quanity = this.billForm.get("items").value[index]["quanity"];
      if (perticulars == "" || amount < 0 || quanity < 0) {
        this.openSnakbar("Fill the row first", "Close");
        this.billForm.get("items").get([index]).get("verified").setValue(false);
      } else {
        this.billForm.get("items").get([index]).disable();
        this.billForm.get("items").get([index]).get("verified").enable();
      }
    } else {
      this.billForm.get("items").get([index]).enable();
    }

  }

  setBillAmountDetails(event: BillAmountDetails) {
    this.billAmountDetails = event;
  }

  setPaymentFormData(event) {
    this.paymentDetails = event.value;
  }

}
