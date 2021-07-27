import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lengthValidator } from 'src/app/directives/length-validator.directive';
import { ClientsService } from 'src/app/services/clients.service';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit {
  mode = 'indeterminate';
  displayProgressSpinner = false;
  editInProgress = false;
  disableSaveButton = false;
  clientId;
  intialFormValue;
  clientForm = this.fb.group({
    'clientName': ['', Validators.required],
    'mobile': ['', {
      validators: [Validators.required, lengthValidator(10)],
      updateOn: 'blur'
    }],
    'email': ['', { validators: Validators.email, updateOn: 'blur' }],
    'gstNumber': [''],
    'isActive': [true, Validators.required],
    'address': this.fb.group({
      'storeName': ['', Validators.required],
      'addressLine1': ['', Validators.required],
      'addressLine2': ['', Validators.required],
      'city': ['', Validators.required],
      'state': ['', Validators.required],
      'zip': ['', Validators.required],
      'country': [{ value: 'India', disabled: true }, Validators.required],
    })

  });

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private clientsService: ClientsService) {
    this.clientId = this.activatedRoute.snapshot.paramMap.get("clientId");
  }

  ngOnInit(): void {
    this.clientForm.disable();
    this.clientsService.getClientById(this.clientId).subscribe(data => {
      // this.clientForm.get("clientId").setValue(data.clientId);
      this.clientForm.get("clientName").setValue(data.clientName);
      this.clientForm.get("mobile").setValue(data.mobile);
      this.clientForm.get("email").setValue(data.email);
      this.clientForm.get("gstNumber").setValue(data.gstNumber);
      // this.clientForm.get("isActive").setValue(data.isActive);
      //address
      this.clientForm.get("address").get("storeName").setValue(data.address.storeName);
      this.clientForm.get("address").get("addressLine1").setValue(data.address.addressLine1);
      this.clientForm.get("address").get("addressLine2").setValue(data.address.addressLine2);
      this.clientForm.get("address").get("city").setValue(data.address.city);
      this.clientForm.get("address").get("state").setValue(data.address.state);
      this.clientForm.get("address").get("zip").setValue(data.address.zip);
      this.clientForm.get("address").get("country").setValue(data.address.country);
      this.intialFormValue = JSON.stringify(this.clientForm.getRawValue());
    });

    this.clientForm.valueChanges.subscribe(() => {
      this.disableSaveButton = false;
    })
  }

  onEditClick() {
    this.clientForm.enable();
    this.clientForm.get("address").get("country").disable();
    this.editInProgress = true;
  }

  onCanclelClick() {
    this.disableSaveButton = false;
    this.editInProgress = false;
    this.clientForm.disable();
  }

  onSaveClick() {
    const newValue = JSON.stringify(this.clientForm.getRawValue());
    if (newValue === this.intialFormValue) {
      this.toastrService.error("No changes to the form!")
    } else {
      this.disableSaveButton = true;
      this.clientsService.updateClient(this.clientId, this.clientForm).subscribe(data => {
        this.disableSaveButton = false;
        this.editInProgress = false;
        this.toastrService.success("Successfully updated client!");
        this.clientForm.disable();
      }, error => {
        this.toastrService.error(error.error.error);
      });
    }
  }
}
