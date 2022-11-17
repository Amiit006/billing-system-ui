import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-date-range-selector',
  templateUrl: './date-range-selector.component.html',
  styleUrls: ['./date-range-selector.component.css']
})
export class DateRangeSelectorComponent implements OnInit {

  @Input() pageInitiator;

  @Input() maxDate=new Date();
  @Output() rangeEmitter = new EventEmitter<FormGroup>();

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  constructor(private toastrService: ToastrService) { }

  ngOnInit(): void {
    if(this.pageInitiator == 'SellReport') {
      const sell_report_from_date = sessionStorage.getItem('sell_report_from_date');
      const sell_report_to_date = sessionStorage.getItem('sell_report_to_date');
      this.setRange(sell_report_from_date, sell_report_to_date);
    }
  }

  setRange(from_date, to_date) {
    if(from_date) {
      this.range.get('start').setValue(new Date(from_date));
    }
    if(to_date) {
      this.range.get('end').setValue(new Date(to_date));
    }
  }

  emitDate() {
    if(moment(this.range.get('end').value).isBefore(moment(this.range.get('start').value))) {
      console.log("Triggered");
      this.toastrService.error("To Date can't be less that endDate ")
    } else {
      this.rangeEmitter.emit(this.range);
    }
    
  }

}
