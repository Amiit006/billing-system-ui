import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent implements OnInit {
  clientId;
  displayedColumns: string[] = ['paymentDate', 'amount', 'paymentMode'];
  dataSource = new MatTableDataSource();
  showSpinner = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() createNewPayment = new EventEmitter<boolean>();

  constructor(private paymentService: PaymentService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.clientId = this.activatedRoute.snapshot.paramMap.get("clientId");
    this.paymentService.getPaymentByClientId(this.clientId).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.showSpinner = false;
    });
  }

  onNewPaymentClick() {
    this.createNewPayment.emit(true);
  }
}
