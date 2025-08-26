import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css'],
})
export class PaymentDetailsComponent implements OnInit, OnDestroy {
  clientId;
  displayedColumns: string[] = ['paymentDate', 'amount', 'paymentMode'];
  dataSource = new MatTableDataSource<any>();
  showSpinner = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() createNewPayment = new EventEmitter<boolean>();

  constructor(
    private paymentService: PaymentService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.clientId = this.activatedRoute.snapshot.paramMap.get('clientId');
    this.paymentService
      .getPaymentByClientId(this.clientId)
      .subscribe((data) => {
        const sorted = data.sort(
          (a, b) =>
            new Date(b.paymentDate).getTime() -
            new Date(a.paymentDate).getTime()
        );
        this.dataSource = new MatTableDataSource(sorted);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.showSpinner = false;
      });
  }

  ngOnDestroy(): void {
    this.dataSource.disconnect();
  }

  onNewPaymentClick() {
    this.createNewPayment.emit(true);
  }
}
