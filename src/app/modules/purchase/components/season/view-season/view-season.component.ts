import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeasonService } from '../../../services/season.service';

@Component({
  selector: 'app-view-season',
  templateUrl: './view-season.component.html',
  styleUrls: ['./view-season.component.css']
})
export class ViewSeasonComponent implements OnInit {

  constructor(private seasonService: SeasonService, private router: Router) { }
  seasons = [];
  isDataLoaded = false;
  ngOnInit(): void {
    this.refreshData();
    this.seasonService.refreshViewData.subscribe(data => {
      console.log(data);
      if (data)
        this.refreshData();
    })
  }

  refreshData() {
    this.seasonService.findAllSeasons()
      .subscribe(data => {
        this.seasons = data;
        console.log(this.seasons);
        this.isDataLoaded = true;
      });
  }

  getClass(seasonName: string) {
    if(seasonName.toLocaleLowerCase().includes("winter")) {
      return "fa fa-snowflake-o";
    } else if(seasonName.toLocaleLowerCase().includes("summer")) {
      return "fa fa-sun-o";
    } else {
      return "fa fa-cloud";
    }
  }

  onClick(seasonId) {
    const selectedSeason = this.seasons.find(season => season.seasonId === seasonId);
    localStorage.setItem("selectedSeason", JSON.stringify(selectedSeason));
    this.router.navigateByUrl("purchase/season/" + seasonId, { state: { selectedSeason: selectedSeason }});
  }

}
