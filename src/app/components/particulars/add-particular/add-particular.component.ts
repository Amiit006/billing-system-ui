import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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
  submitted = false;

  particularForm = this.fb.group({
    particular: ['', Validators.required],
    discountPercentage: [0, Validators.required]
  });

  saveInProgress = false;

  constructor(
    private fb: FormBuilder,
    private particularService: ParticularsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  createParticular() {
    this.submitted = true;
    if (this.particularForm.invalid) return;

    this.saveInProgress = true;
    this.displayProgressSpinner = true;

    const { particular, discountPercentage } = this.particularForm.value!;
    this.particularService.addParticular(particular!, discountPercentage!)
      .subscribe({
        next: () => {
          this.toastr.success(SnackBarMessage.PARTICULAR_CREATED);
          this.particularForm.reset({ particular: '', discountPercentage: 0 });
          this.submitted = false;
          this.saveInProgress = false;
          this.displayProgressSpinner = false;
          this.particularService.refreshParticulars();
        },
        error: (err) => {
          this.toastr.error(err?.error ?? 'Failed to create particular');
          this.saveInProgress = false;
          this.displayProgressSpinner = false;
        }
      });
  }
}
