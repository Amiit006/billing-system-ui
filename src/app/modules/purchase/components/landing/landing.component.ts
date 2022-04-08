import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Season } from '../../model/season.model';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  selectedSeason;
  constructor(private router: Router, private activeRoute: ActivatedRoute) {
    this.selectedSeason = this.router.getCurrentNavigation().extras.state?.selectedSeason;
    if(!this.selectedSeason) {
      this.selectedSeason = JSON.parse(localStorage.getItem("selectedSeason"));
      console.log(this.selectedSeason);
    }
  }

  ngOnInit(): void {
  }

  onAddPurchaseClick() {
    const seasonId = this.activeRoute.snapshot.paramMap.get('seasonId');
    this.router.navigateByUrl("/purchase/season/" + seasonId + "/addPurchase", { state: { selectedSeason: this.selectedSeason } });
  }

}
