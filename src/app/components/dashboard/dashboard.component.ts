import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  year = new Date().getFullYear();
  sellView: [number, number] = [500, 400];
  monthlyView: [number, number] = [500, 400];
  topBuyerView: [number, number] = [500, 400];
  topProductView: [number, number] = [500, 400];

  constructor() {}

  ngOnInit(): void {}
}
