import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseService } from '../../services/purchase.service';
import { PaymentsComponent } from '../payments/payments.component';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('detailTrasport', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ],
})
export class PurchasesComponent implements OnInit {
  displayedColumns: string[] = ['partyName', 'purchaseDate', 'purchaseAmount', 'packingCharge', 'taxAmount', 'discountAmount', 'extraDiscountAmount', 'totalPayble', 'payments', 'pending', 'action'];
  displayedColumnsValue: string[] = ['Party Name', 'Purchase Date', 'Purchase Amount', 'Packing', 'Tax', 'Disc', 'Extra Disc', 'Final Amount'];
  displayedColumns1: string[] = ['paymentDone', 'paymentPending'];

  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  expandedElement: any | null;

  constructor(private purchaseService: PurchaseService, public dialog: MatDialog, private activeRoute: ActivatedRoute, private toastrService: ToastrService) { }

  ngOnInit(): void {
    const seasonId = this.activeRoute.snapshot.paramMap.get('seasonId');
    this.getPurchasesBySeason(seasonId);
  }

  getPurchasesBySeason(seasonId) {
    this.purchaseService.getPurchasesBySeason(seasonId).subscribe((data: any[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }
  getColumnValue(element, column) {
    if (column === 'totalPayble') {
      const purchaseAmount = element['purchaseAmount'];
      const discountAmount = element['discountAmount'];
      const extraDiscountAmount = element['extraDiscountAmount'];
      const taxAmount = element['taxAmount'];
      const packingCharge = element['packingCharge'];
      return purchaseAmount + taxAmount + packingCharge - discountAmount - extraDiscountAmount;
    }
    return element[column];
  }
  getPaymentAmount(payments) {
    return payments.map(t => t.amount).reduce((a, b) => a + b, 0);
  }

  getPaymentPendingAmount(input) {
    const totalPaymentDone = input['payments'].map(t => t.amount).reduce((a, b) => a + b, 0);
    const purchaseAmount = input['purchaseAmount'];
    const discountAmount = input['discountAmount'];
    const extraDiscountAmount = input['extraDiscountAmount'];
    const taxAmount = input['taxAmount'];
    const packingCharge = input['packingCharge'];
    return purchaseAmount + packingCharge + taxAmount - discountAmount - extraDiscountAmount - totalPaymentDone;
  }
  
  onNewPaymentClick(purchaseId) {
    const seasonId = this.activeRoute.snapshot.paramMap.get('seasonId');
    const dialogRef = this.dialog.open(PaymentsComponent, {
      width: '1150px',
      data: { purchaseId: purchaseId, seasonId: seasonId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.toastrService.success(result.response);
        this.getPurchasesBySeason(seasonId);
      }
    });
  }

}
