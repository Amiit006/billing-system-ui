import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.css']
})
export class AddPurchaseComponent implements OnInit {

  purchaseForm = this.fb.group({
    'partyName': ['', Validators.required],
    'purchaseDate': [Validators.required],
    'purchaseAmount': [0, Validators.required],
    'packingCharge': [0, Validators.required],
    'taxPercent': [0, Validators.required],
    'taxAmount': [0, Validators.required],
    'discountPercent': [0, Validators.required],
    'discountAmount': [0, Validators.required],
    'extraDiscountAmount': [0, Validators.required],
    'transport': this.fb.group({
      'transportName': ['', Validators.required],
      'amount': [0, Validators.required],
      'consignmentNumber': [0, Validators.required]
    }), 'payments':
      this.fb.array([
        // this.getPayment()
      ])
  });


  getPayment() {
    return this.fb.group({
      'mode': ['cash'],
      'chequeNo': [''],
      'paymentDate': [new Date(), Validators.required],
      'remark': [''],
      'amount': [0]
    });
  }

  get skills(): FormArray {
    return this.purchaseForm.get("payments") as FormArray
  }

  maxDate = new Date();
  minDate = new Date();
  selectedSeason;
  constructor(private router: Router, private tosterService: ToastrService, private fb: FormBuilder, private activeRoute: ActivatedRoute, private purchaseService: PurchaseService) {
    this.selectedSeason = this.router.getCurrentNavigation().extras.state?.selectedSeason;
    this.minDate = new Date(this.selectedSeason.startDate);
    this.maxDate = new Date(this.selectedSeason.endDate);
  }

  ngOnInit(): void {
    const control = this.purchaseForm;
    control.get("taxPercent").disable();
    control.get("discountPercent").disable();
  }

  onSave() {
    const seasonId = this.activeRoute.snapshot.paramMap.get('seasonId');
    this.purchaseService.createPurchase(seasonId, this.purchaseForm.getRawValue()).subscribe(data => {
      this.tosterService.success("Purchase added successfully!");
      this.router.navigateByUrl("/purchase/season/" + seasonId, 
          { state: { selectedSeason: this.selectedSeason } });
    }), error => this.tosterService.error("Error while saving!");
  }

  paymentModes = [
    { 'viewValue': 'Cash', 'value': 'cash' },
    { 'viewValue': 'Bank Transfer', 'value': 'bankTransfer' },
    { 'viewValue': 'Cheque', 'value': 'cheque' }
  ]

  onChange(value, index) {
    const control = <FormArray>this.purchaseForm.controls["payments"];
    if (value === 'cheque') {
      control.at(index).get("chequeNo").enable();
      control.at(index).get("chequeNo").setValidators([Validators.required, Validators.min(1)]);
      control.at(index).get("chequeNo").setErrors({ 'invalid': true });
    } else {
      control.at(index).get("chequeNo").setValue('');
      control.at(index).get("chequeNo").disable();
      control.at(index).get("chequeNo").clearValidators();
    }
  }

  onTaxAmountChange() {
    console.log("fired")
    const control = this.purchaseForm;
    const taxAmount = control.get("taxAmount").value;
    const purchaseAmount = control.get("purchaseAmount").value;
    const taxPercent = ((taxAmount / purchaseAmount) * 100).toFixed(2);
    control.get("taxPercent").setValue(taxPercent);
  }

  onDiscountAmountChange() {
    const control = this.purchaseForm;
    const discountAmount = control.get("discountAmount").value;
    const purchaseAmount = control.get("purchaseAmount").value;
    const taxAmount = control.get("taxAmount").value;
    const discountPercent = ((discountAmount / (purchaseAmount + taxAmount)) * 100).toFixed(2);
    control.get("discountPercent").setValue(discountPercent);
  }

  onDiscountPercentEnable() {
    const control = this.purchaseForm;
    control.get("discountPercent").enable();
    // const purchaseAmount = control.get("purchaseAmount").value;
  }

  addPayment() {
    const control = <FormArray>this.purchaseForm.controls["payments"];
    control.push(this.getPayment());
    console.log(control.length)
    this.onChange("cash", control.length - 1);
  }

  removeUnit(index) {
    const control = <FormArray>this.purchaseForm.controls["payments"];
    control.removeAt(index);
  }

}
