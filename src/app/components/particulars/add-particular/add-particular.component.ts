import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ParticularsService } from 'src/app/services/particulars.service';

@Component({
  selector: 'app-add-particular',
  templateUrl: './add-particular.component.html',
  styleUrls: ['./add-particular.component.css']
})
export class AddParticularComponent implements OnInit {

  constructor(private fb: FormBuilder, private particularService: ParticularsService) { }

  particularForm = this.fb.group({
    'particular': ['', Validators.required]
  });

  ngOnInit(): void {
  }

  createParticular() {
    this.particularService.addParticular(this.particularForm.get('particular').value).subscribe(data => {
      console.log(data);
    });
  }
}
