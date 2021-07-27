import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Particulars } from 'src/app/model/particulars.model';
import { SnackBarMessage } from 'src/app/model/snackbar-message.enum';
import { ParticularsService } from 'src/app/services/particulars.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {
  panelOpenState = true;
  slNoCount = 0;
  @Output() subTotalBillAmount = new EventEmitter<number>();;
  noOfPerticulars = 0;

  qntTypes: any = [{ 'id': 'pc', 'value': 'Pc' }, { 'id': 'dz', 'value': 'Dz' }];

  particulars: Particulars[] = [];

  @Output() billFormData = new EventEmitter();

  @ViewChildren('formRow', { read: ElementRef }) rows: QueryList<ElementRef>;

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private router: Router,
    private cdRef: ChangeDetectorRef,
    private particularService: ParticularsService) { }

  ngOnInit(): void {
    this.particularService.getAllParticulars().subscribe(data => {
      this.particulars = data;
    }, error => console.log(error.error))
    this.billForm.valueChanges.subscribe(() => {
      this.billFormData.emit(this.billForm);
    })
    this.testMe();
  }

  testMe() {
    const initialResult = {
      'perticulars': '1',
      'amount': 1,
      'quanity': 1,
    }
    for (let index = 0; index < 5; index++) {
      this.addRow();
      const val = (<FormArray>this.billForm.get('items')).at(index);
      val.get('perticulars').setValue('Partucular ' + index);
      val.get('amount').setValue(Math.floor((Math.random() * 100) + 1));
      val.get('quanity').setValue(Math.floor((Math.random() * 100) + 1));
      val.get('total').setValue(val.get('amount').value * val.get('quanity').value);
      
      const amount = this.billForm.get("items").value[index]["amount"];
      const quanity = this.billForm.get("items").value[index]["quanity"];
      const discount = this.billForm.get("items").value[index]["discount"];
      const discountPrice = (amount * quanity) - (amount * quanity * discount / 100);
      (<FormArray>this.billForm.get("items")).controls[index].get("discountPrice").setValue(discountPrice);

    }
  }

  selectedItem(item, index) {
    const discountPercentage = this.particulars.find(data => data.particularName === item.item).discountPercentage;
    (<FormArray>this.billForm.get("items")).controls[index].get("discount").setValue(discountPercentage);
  }

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
      'discount': [0],
      'total': [{ value: 0, disabled: true }],
      'discountPrice': [{ value: 0, disabled: true }],
      'quantityType': ['pc', Validators.required],
      'verified': [false, Validators.requiredTrue]
    });
  };

  addRow() {
    (<FormArray>this.billForm.get("items")).push(
      this.addbillFormGroup()
    );
  }

  private inputToFocus: any;

  @ViewChildren('inputToFocus') set inputF(inputF: QueryList<ElementRef>) {
    this.inputToFocus = inputF.filter(x => x?.nativeElement.value === "");
    if (this.inputToFocus.length > 0) {
      this.inputToFocus[0].nativeElement.focus();
    } else {
      this.inputToFocus = inputF;
      this.inputToFocus.last.nativeElement.focus();
    }
    this.cdRef.detectChanges();
  }

  addRowAbove(event, index) {
    if (event) {
      if (this.billForm.valid) {
        const billFrm = (<FormArray>this.billForm.get("items"));
        billFrm.insert(index, this.addbillFormGroup());
        this.reassignSlNo();
      } else {
        this.openSnakbar(SnackBarMessage.BLANK_ROW, SnackBarMessage.CLOSE);
      }
    }
  }

  removeRow(index) {
    const billFrm = (<FormArray>this.billForm.get("items"));
    if (billFrm.length == 1) {
      this.openSnakbar(SnackBarMessage.ONE_ROW_MUST, SnackBarMessage.CLOSE);
    }
    else if (billFrm.length > 1) {
      // this.inputToFocus1 = this.rows.filter((x, i) => i === index);
      // this.inputToFocus1[0].nativeElement.style.display = 'none';
      // Undo action  
      var tempRow = billFrm.at(index);
      (<FormArray>this.billForm.get("items")).removeAt(index);
      this.reassignSlNo();
      this.cdRef.detectChanges();
      var undoAction = this._snackBar.open("Row deleted", "undo", {
        duration: 2000
      });
      this.calculateSubtotalBillAmount();
      undoAction.afterDismissed().subscribe(data => {
        if (data.dismissedByAction) {
          // this.inputToFocus1[0].nativeElement.style.display = 'flex';
          (<FormArray>this.billForm.get("items")).insert(index, tempRow);

          if (index !== this.slNoCount) {
            this.reassignSlNo();
          }
          this.calculateSubtotalBillAmount();
          this.cdRef.detectChanges();
        }
      });
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === 'F4') { // || event.code === 'Enter') {
      if (this.billForm.valid)
        this.addRow();
      else
        this.openSnakbar(SnackBarMessage.BLANK_ROW, SnackBarMessage.CLOSE)
    }
  }

  reassignSlNo() {
    let value = 1;
    (<FormArray>this.billForm.get("items")).controls.map(x => {
      x.get("slNo").setValue(value);
      value += 1;
    });
    this.slNoCount = value - 1;
  }


  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.particulars
          .filter(v => v.particularName.toLowerCase().indexOf(term.toLowerCase()) > -1)
          .map(v => v.particularName)
          .slice(0, 10))
    )

  onChange(i) {
    this.calculateAndPopulateTotal(i);
  }

  onQntyChange(i) {
    this.calculateAndPopulateTotal(i);
  }

  calculateAndPopulateTotal(index) {
    const amount = this.billForm.get("items").value[index]["amount"];
    const quanity = this.billForm.get("items").value[index]["quanity"];
    const discount = this.billForm.get("items").value[index]["discount"];
    (<FormArray>this.billForm.get("items")).controls[index].get("total").setValue(amount * quanity);
    const discountPrice = (amount * quanity) - (amount * quanity * discount / 100);
    (<FormArray>this.billForm.get("items")).controls[index].get("discountPrice").setValue(discountPrice);
    this.calculateSubtotalBillAmount();
  }

  calculateSubtotalBillAmount() {
    let subTotal = 0;
    (<FormArray>this.billForm.get("items")).controls.map(x => {
      subTotal += x.get('discountPrice').value;
    });
    this.subTotalBillAmount.emit(subTotal);
  }

  openSnakbar(msg, action, time = 2000) {
    this._snackBar.open(msg, action, {
      duration: time
    });
  }

  verifyRow(index, event: MatCheckboxChange) {
    if (event.checked) {
      const perticulars = this.billForm.get("items").value[index]["perticulars"];
      const amount = this.billForm.get("items").value[index]["amount"];
      const quanity = this.billForm.get("items").value[index]["quanity"];
      if (perticulars == "" || amount < 0 || quanity < 0) {
        this.openSnakbar(SnackBarMessage.BLANK_ROW, SnackBarMessage.CLOSE);
        this.billForm.get("items").get([index]).get("verified").setValue(false);
      } else {
        this.billForm.get("items").get([index]).disable();
        this.billForm.get("items").get([index]).get("verified").enable();
      }
    } else {
      this.billForm.get("items").get([index]).enable();
    }
  }

}
