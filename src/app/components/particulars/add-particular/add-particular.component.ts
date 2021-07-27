import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { error } from 'selenium-webdriver';
import { SnackBarMessage } from 'src/app/model/snackbar-message.enum';
import { ParticularsService } from 'src/app/services/particulars.service';

@Component({
  selector: 'app-add-particular',
  templateUrl: './add-particular.component.html',
  styleUrls: ['./add-particular.component.css']
})
export class AddParticularComponent implements OnInit {
  mode = 'indeterminate';
  displayProgressSpinner = false;
  
  particularForm = this.fb.group({
    'particular': ['', Validators.required],
    'discountPercentage': [0, Validators.required]
  });

  saveInProgress: boolean = false;

  constructor(private fb: FormBuilder, private particularService: ParticularsService
    , private toastr: ToastrService) { }


  ngOnInit(): void {
  }

  createParticular() {
    this.saveInProgress = true;
    this.displayProgressSpinner = true;
    this.particularService.addParticular(this.particularForm.get('particular').value, this.particularForm.get('discountPercentage').value).subscribe(data => {
      this.toastr.success(SnackBarMessage.PARTICULAR_CREATED);
      this.particularForm.get('particular').setValue("");
      this.particularForm.get('discountPercentage').setValue(0);
      this.saveInProgress = false;
      this.particularService.refreshParticulars();
      this.displayProgressSpinner = false;
    }, error => {
      this.toastr.error(error.error);
      this.saveInProgress = false;
      this.displayProgressSpinner = false;
    });
  }
}
