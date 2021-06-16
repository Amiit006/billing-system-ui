import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-single-client-board',
  templateUrl: './single-client-board.component.html',
  styleUrls: ['./single-client-board.component.css']
})
export class SingleClientBoardComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }

  onNewBillClick(event: boolean) {
    if(event) {
      const clientId = this.activatedRoute.snapshot.paramMap.get("clientId");
      this.router.navigate(["new-bill"], { state: { clientId: clientId } })
    }
  }

  onNewPaymentClick(event: boolean) {
    if(event) {
      const clientId = this.activatedRoute.snapshot.paramMap.get("clientId");
      this.router.navigate(["new-payment"], { state: { clientId: clientId } })
    }
  }

}
