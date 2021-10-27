import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-show-chart-toggler',
  templateUrl: './show-chart-toggler.component.html',
  styleUrls: ['./show-chart-toggler.component.css']
})
export class ShowChartTogglerComponent implements OnInit {

  @Input() showData = false;

  @Input() showButtonLabel;
  @Input() hideButtonLabel;

  @Output() status = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  toggleShowData() {
    this.showData = !this.showData;
    this.status.emit(this.showData);
  }

}
