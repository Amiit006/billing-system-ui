import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { single } from '../data';

@Component({
  selector: 'app-monthly-sell',
  templateUrl: './monthly-sell.component.html',
  styleUrls: ['./monthly-sell.component.css']
})
export class MonthlySellComponent implements OnInit {
  monthlySellList: any[] = [];
  multi: any[];

  view: any[] = [500, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = 'Sell';

  colorScheme = {
    domain: ['#FFADAD', '#0096c7', '#FDFFB6', '#A0C4FF']
  };
  
  showData = false;
  
  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.getMonthlySellStats().subscribe(data => {
      this.monthlySellList = data;
      console.log(this.monthlySellList);
      // this.monthlySellList = single;
    }, error => console.log(error.error.error));
    
  }

  setStatus(event) {
    this.showData = event;
  }

}
