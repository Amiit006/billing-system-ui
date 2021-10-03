import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-date-range-selector',
  templateUrl: './date-range-selector.component.html',
  styleUrls: ['./date-range-selector.component.css']
})
export class DateRangeSelectorComponent implements OnInit {


  @Output() rangeEmitter = new EventEmitter<FormGroup>();

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  constructor(private toastrService: ToastrService) { }

  ngOnInit(): void {
  }

  emitDate() {
    console.log(this.range);
    if(moment(this.range.get('end').value).isBefore(moment(this.range.get('start').value))) {
      console.log("Triggered");
      this.toastrService.error("To Date can't be less that endDate ")
    } else {
      this.rangeEmitter.emit(this.range);
    }
    
  }

}
