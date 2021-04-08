import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BillAmountDetails } from 'src/app/model/bill-amount-details.model';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  state$: Observable<any>;

  currentDate = new Date();

  billFormData;
  billAmountDetails: BillAmountDetails;
  paymentDetails;

  constructor(public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.state$ = this.activatedRoute.paramMap
      .pipe(map(() => window.history.state))
    this.state$.subscribe(data => {
      this.billFormData = data.billFormValue.items;
      this.billAmountDetails = data.billAmountDetails;
      this.paymentDetails = data.paymentDetails;
    });
  }

  onPrint() {
    const printContent = document.getElementById("print-body");
    // const WindowPrt = window.open('', '', 'left=0,top=0,toolbar=0,scrollbars=0,status=0');
    // WindowPrt.document.write(printContent.innerHTML);
    // WindowPrt.document.close();
    // WindowPrt.focus();
    // WindowPrt.print();

    var w = window.open();
    w.document.write('<html><head><title>Print Document</title>');
    w.document.write('<link rel="stylesheet" href="assets/css/appstyles.css">');
    w.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous">');
    w.document.write('</head><body>');
    w.document.write(`
    <div class="container">
        <div class="row">
            <div class="col-12 text-center">
            <a href="javascript:;"  onclick="window.print()">Print</a>
            </div>
        </div>
    </div>
    `);
    w.document.write(printContent.innerHTML);
    w.document.write('</body></html>');
    // w.print();
    w.document.close();
  }

}
