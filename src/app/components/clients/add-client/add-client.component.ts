import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { lengthValidator } from 'src/app/directives/length-validator.directive';
import { Client } from 'src/app/model/client.model';
import { ClientsService } from 'src/app/services/clients.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent implements OnInit {

  disableSaveButton = false;

  constructor(private fb: FormBuilder, private clientsService: ClientsService
    , private toastr: ToastrService) { }

  clientForm = this.fb.group({
    'clientName': ['', Validators.required],
    'mobile': ['', {
      validators: [Validators.required, lengthValidator(10)],
      updateOn: 'blur'
    }],
    'email': ['', {validators: Validators.email, updateOn: 'blur'}],
    'gstNumber': [''],
    'isActive': [true, Validators.required],
    'address': this.fb.group({
      'storeName': ['', Validators.required],
      'address1': ['', Validators.required],
      'address2': ['', Validators.required],
      'city': ['', Validators.required],
      'state': ['', Validators.required],
      'zip': ['', Validators.required],
      'country': [{ value: 'India', disabled: true }, Validators.required],
    })

  });


  ngOnInit(): void {
    const gstNumberControl = this.clientForm.get('gstNumber');
    gstNumberControl.valueChanges.subscribe(() => {
      gstNumberControl.patchValue(gstNumberControl.value.toUpperCase(), { emitEvent: false });
    });

    this.clientForm.valueChanges.subscribe(() => {
      this.disableSaveButton = false;
    })

  }

  onSubmission() {
    this.disableSaveButton = true;
    const client: Client = {
      clientId: 0,
      clientName: this.clientForm.get("clientName").value,
      mobile: this.clientForm.get("mobile").value,
      email: this.clientForm.get("email").value,
      gstNumber: this.clientForm.get("gstNumber").value,
      isActive: true,
      address: {
        addressId: 0,
        storeName: this.clientForm.get("address").get("storeName").value,
        addressLine1: this.clientForm.get("address").get("address1").value,
        addressLine2: this.clientForm.get("address").get("address2").value,
        city: this.clientForm.get("address").get("city").value,
        state: this.clientForm.get("address").get("state").value,
        country: this.clientForm.get("address").get("country").value,
        zip: this.clientForm.get("address").get("zip").value,
      }
    }
    this.clientsService.createClient(client).subscribe(data => {
      this.toastr.success("Client Created Successfully");
    }, error => {
      this.disableSaveButton = false;
      this.toastr.error(error.error.error);
    });
  }

}
