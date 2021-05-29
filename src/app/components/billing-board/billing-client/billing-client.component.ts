import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientsService } from 'src/app/services/clients.service';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Client } from 'src/app/model/client.model';
import { BillingService } from 'src/app/services/billing.service';

@Component({
  selector: 'app-billing-client',
  templateUrl: './billing-client.component.html',
  styleUrls: ['./billing-client.component.css']
})
export class BillingClientComponent implements OnInit {

  // queryField: FormControl = new FormControl();

  clientDetails: Client[];
  filteredResult: Client[];
  showDropdown = true;
  showClientDetails = false;
  noResultFound = false;

  @Output() clientFormData = new EventEmitter();
  
  billingClientForm = this.fb.group({
    'clientId': [],
    'clientName': [''],
    'mobile': [{ value: 0, disabled: true }],
    'email': [{ value: '', disabled: true }],
    'gstNumber': [{ value: '', disabled: true }],
    'isActive': [true],
    'address': this.fb.group({
      'storeName': [{ value: '', disabled: true }],
      'address1': [{ value: '', disabled: true }],
      'address2': [{ value: '', disabled: true }],
      'city': [{ value: '', disabled: true }],
      'state': [{ value: '', disabled: true }],
      'zip': [{ value: '', disabled: true }],
      'country': [{ value: '', disabled: true }],
    })
  });

  constructor(private fb: FormBuilder, private clientService: ClientsService
    ) { }
  
  ngOnInit(): void {
    this.clientService.getAllParticulars().subscribe(data => {
      this.clientDetails = data;
    });
    this.billingClientForm.get("clientName").valueChanges.subscribe(() => {
      this.clientFormData.emit(this.billingClientForm);
    })
    // this.queryField.valueChanges
    //   .pipe(debounceTime(200), distinctUntilChanged())
    //   .subscribe(term => {
    //     const value = this.clientDetails.filter(v => v.clientName.toLocaleLowerCase().includes(term.toLocaleLowerCase()))
    //     this.filteredResult = value;
    //     this.queryField.value
    //   });
  }

  onClick(result: Client) {
    this.billingClientForm.get("clientName").setValue(result.clientName)
    this.showDropdown = false;
    this.showClientDetails = true;
    this.setBillingClientForm(result);
  }

  onSearchEnter() {
    this.billingClientForm.get("clientName").setErrors({'incorrect': true});
    if(this.billingClientForm.get("clientName").value === '') {
      this.showDropdown = false;
      return;  
    }
    this.showDropdown = true;
    this.showClientDetails = false;
    this.noResultFound = false;
    
    const searchTerm = this.billingClientForm.get("clientName").value;
    const value = this.clientDetails.filter(v => v.clientName.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()));
    this.filteredResult = value;
    if(this.filteredResult.length == 0) {
      this.noResultFound = true;
    }
  }

  setBillingClientForm(result: Client) {
    this.billingClientForm.get('clientId').setValue(result.clientId);
    this.billingClientForm.get('clientName').setValue(result.clientName);
    this.billingClientForm.get('mobile').setValue(result.mobile);
    this.billingClientForm.get('email').setValue(result.email);
    this.billingClientForm.get('gstNumber').setValue(result.gstNumber);
    this.billingClientForm.get('isActive').setValue(result.isActive);
    this.billingClientForm.get('address').get('storeName').setValue(result.address.storeName);
    this.billingClientForm.get('address').get('address1').setValue(result.address.addressLine1);
    this.billingClientForm.get('address').get('address2').setValue(result.address.addressLine2);
    this.billingClientForm.get('address').get('city').setValue(result.address.city);
    this.billingClientForm.get('address').get('state').setValue(result.address.state);
    this.billingClientForm.get('address').get('zip').setValue(result.address.zip);
    this.billingClientForm.get('address').get('country').setValue(result.address.country);
  }

}
