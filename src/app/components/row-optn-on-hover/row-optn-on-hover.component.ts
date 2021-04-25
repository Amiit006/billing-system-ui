import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-row-optn-on-hover',
  templateUrl: './row-optn-on-hover.component.html',
  styleUrls: ['./row-optn-on-hover.component.css']
})
export class RowOptnOnHoverComponent implements OnInit {

  @Output() addButtonClicked = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  onClick() {
    this.addButtonClicked.emit(true);
  }

}
