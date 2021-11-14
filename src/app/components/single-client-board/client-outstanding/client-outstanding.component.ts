import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartResponse } from 'src/app/model/chart-response.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-client-outstanding',
  templateUrl: './client-outstanding.component.html',
  styleUrls: ['./client-outstanding.component.css']
})
export class ClientOutstandingComponent implements OnInit {
  single: ChartResponse[] = [];
  view: any[] = [1100, 200];
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  cardColor: string = '#232837';

  constructor(private activatedRoute: ActivatedRoute, private dashboardService: DashboardService,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.getClientOutstanding();
    this.sharedService.reload.subscribe(data => {
      this.getClientOutstanding();
    })
  }

  getClientOutstanding() {
    var clientId = this.activatedRoute.snapshot.paramMap.get("clientId");
    this.dashboardService.getClientOutstanding(+clientId).subscribe(data => {
      this.single = data;
    })
  }

}
