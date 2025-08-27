import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ChartResponse } from 'src/app/model/chart-response.model';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-sell-collection',
  templateUrl: './sell-collection.component.html',
  styleUrls: ['./sell-collection.component.css']
})
export class SellCollectionComponent implements OnInit {
  
  single: ChartResponse[] = [];
  @Input() view: any[] = [550, 200];
  year = new Date().getFullYear();

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  cardColor: string = '#232837';
  
  constructor(public dashboardService: DashboardService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.dashboardService.getSellCollectionStats(this.year).subscribe(data => {
      this.single = data.map(datum => ({ name: datum.name, value: '₹ ' + datum.value }));
    }, error => console.log(error.error.error));
  }

  onSelect(event) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = event.value;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    this.toastrService.info("Copied to clipboard");
  }

  showData = false;
  setStatus(event) {
    this.showData = event;
  }

}
