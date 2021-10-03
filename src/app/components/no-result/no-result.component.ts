import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-result',
  templateUrl: './no-result.component.html',
  styleUrls: ['./no-result.component.css']
})
export class NoResultComponent implements OnInit {

  @Input() imageUrl = "assets/noresults.svg";
  @Input() h3TextInput = "Report's empty";
  @Input() pTextInput = "We couldn't find any results for your query";

  @Input() pclass = "";

  constructor() { }

  ngOnInit(): void {
  }

}
