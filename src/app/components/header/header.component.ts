import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  onAddClient() {
    this.route.navigateByUrl("clients/add");
  }

  onViewAllClient() {
    this.route.navigateByUrl("clients/view-clients");
  }

}
