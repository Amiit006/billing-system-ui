import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-top-buyer',
  templateUrl: './top-buyer.component.html',
  styleUrls: ['./top-buyer.component.css']
})
export class TopBuyerComponent implements OnInit {

  topCount = 5;
  
  topProductList: any[] = [];
  topBuyerList: any[] = [];
  
  @Input() view: any[] = [500, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Client Name';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Total Sell';

  colorScheme = {
    // domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    domain: ['#FFADAD', '#0096c7', '#FDFFB6', '#A0C4FF']
  };

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.getTopBuyer(this.topCount).subscribe(data => {
      this.topBuyerList = data.map(datum => ({ name: datum.clientName, value: datum.totalPurchasedAmount }));
    }, error => console.log(error.error.error));
    
  }

  showData = false;
  setStatus(event) {
    this.showData = event;
  }

}
