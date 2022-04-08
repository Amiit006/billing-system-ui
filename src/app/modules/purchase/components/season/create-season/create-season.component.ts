import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Season } from '../../../model/season.model';
import { SeasonService } from '../../../services/season.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-season',
  templateUrl: './create-season.component.html',
  styleUrls: ['./create-season.component.css']
})
export class CreateSeasonComponent implements OnInit {


  startMaxDate = new Date();
  endMinDate = new Date();
  seasonForm = this.fb.group({
    'seasonName': ['', Validators.required],
    'startDate': [new Date(), Validators.required],
    'endDate': [new Date(), Validators.required]
  });

  constructor(private fb: FormBuilder, private seasonService: SeasonService, private tosterService: ToastrService) { }

  ngOnInit(): void {
    this.seasonForm.get("startDate").valueChanges.subscribe(data => {
      this.endMinDate = data;
    });
  }

  onSave() {
    const payload = {
      seasonName: this.seasonForm.get("seasonName").value,
      startDate: moment(this.seasonForm.get("startDate").value).format("YYYY-MM-DD HH:mm:ss").toLocaleString(),
      endDate: moment(this.seasonForm.get("endDate").value).format("YYYY-MM-DD HH:mm:ss").toLocaleString()
    }
    this.seasonService.createSeason(payload)
      .subscribe(data => {
        this.tosterService.success("Created Successfully!");
        this.seasonForm.reset();
        this.seasonService.refreshView(true);
      }, error => {
        this.tosterService.error(error.error);
      });
  }

}
