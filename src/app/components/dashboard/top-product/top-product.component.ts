import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-top-product',
  templateUrl: './top-product.component.html',
  styleUrls: ['./top-product.component.css']
})
export class TopProductComponent implements OnInit {

  topCount = 5;
  
  topProductList: any[] = [];
  topBuyerList: any[] = [];
  
  view: any[] = [500, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Particulars';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Total Sell';

  colorScheme = {
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
    this.dashboardService.getTopSellingProduct(this.topCount).subscribe(data => {
      this.topProductList = data.map(datum => ({ name: datum.perticulars, value: datum.totalSell }));
    }, error => console.log(error.error.error));
  }

}
