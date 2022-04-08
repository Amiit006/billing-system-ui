import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ChartResponse } from 'src/app/model/chart-response.model';
import { DashboardServiceService } from '../../services/dashboard-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  single: ChartResponse[] = [];
  view: any[] = [1100,200];

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  cardColor: string = '#232837';

  constructor(public dashboardService: DashboardServiceService, private toastrService: ToastrService,private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const seasonId = this.activatedRoute.snapshot.paramMap.get("seasonId");
    console.log(seasonId);
    this.dashboardService.getPurchasePaymentStats(seasonId).subscribe(data => {
      console.log(data);
      this.single = data;
    })
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

}
