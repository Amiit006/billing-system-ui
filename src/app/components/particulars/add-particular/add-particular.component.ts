import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { error } from 'selenium-webdriver';
import { ParticularsService } from 'src/app/services/particulars.service';

@Component({
  selector: 'app-add-particular',
  templateUrl: './add-particular.component.html',
  styleUrls: ['./add-particular.component.css']
})
export class AddParticularComponent implements OnInit {
  particularForm = this.fb.group({
    'particular': ['', Validators.required]
  });

  saveInProgress: boolean = false;

  constructor(private fb: FormBuilder, private particularService: ParticularsService
    , private toastr: ToastrService) { }


  ngOnInit(): void {
  }

  createParticular() {
    this.saveInProgress = true;
    this.particularService.addParticular(this.particularForm.get('particular').value).subscribe(data => {
      console.log(data);
      this.toastr.success("Created Successfully.");
      this.particularForm.get('particular').setValue("");
      this.saveInProgress = false;
    }, error => {
      console.log(error);
      this.toastr.error(error.error);
      this.saveInProgress = false;
    });
  }
}
