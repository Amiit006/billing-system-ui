import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent implements OnInit {


  constructor(private fb: FormBuilder) { }

  clientForm = this.fb.group({
    'clientName': ['', Validators.required],
    'mobile': ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    'email': [],
    'gstNumber': [''],
    'address': this.fb.group({
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
  }

  onSubmission() {
    console.log(this.clientForm.getRawValue());
  }

}
