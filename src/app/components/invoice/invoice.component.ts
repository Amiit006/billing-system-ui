import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BillAmountDetails } from 'src/app/model/bill-amount-details.model';
import { BillingService } from 'src/app/services/billing.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  state$: Observable<any>;

  currentDate = new Date();

  @Input() clientForm: FormGroup;
  @Input() billForm: FormGroup;
  @Input() paymentForm: FormGroup;
  @Input() billAmountDetails: BillAmountDetails;
  invoiceId: number;
  invoiceSaveStatus = false;
  constructor(public activatedRoute: ActivatedRoute, private billingService: BillingService
    , private toastrService: ToastrService) { }

  ngOnInit(): void {
    
    // this.state$ = this.activatedRoute.paramMap
    //   .pipe(map(() => window.history.state))
    // this.state$.subscribe(data => {
    //   this.clientForm = data.clientForm;
    //   this.billFormData = data.billFormValue.items;
    //   this.billAmountDetails = data.billAmountDetails;
    //   this.paymentDetails = data.paymentDetails;
    // });
    this.billingService.generateInvoiceId().subscribe(data => {
      console.log(data);
      this.invoiceId = data;
    })
    console.log('clientForm', this.clientForm);
    console.log('billForm', this.billForm);
    console.log('paymentForm', this.paymentForm);
    console.log('billAmountDetails', this.billAmountDetails);
  }

  onSave() {
    const value = {
      "invoice": this.billForm.getRawValue().items,
      "client": this.clientForm.getRawValue(),
      "payment": this.paymentForm.getRawValue(),
      "billAmountDetails": this.billAmountDetails
    }
    console.log(value);
    this.billingService.createInvoice(value).subscribe(data => {
      this.invoiceSaveStatus = true;
      this.toastrService.success(data.response);
      console.log(data);    
    });
    // const printContent = document.getElementById("print-body");
    // const WindowPrt = window.open('', '', 'left=0,top=0,toolbar=0,scrollbars=0,status=0');
    // WindowPrt.document.write(printContent.innerHTML);
    // WindowPrt.document.close();
    // WindowPrt.focus();
    // WindowPrt.print();

    // var w = window.open();
    // w.document.write('<html><head><title>Print Document</title>');
    // w.document.write('<link rel="stylesheet" href="assets/css/appstyles.css">');
    // w.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous">');
    // w.document.write('</head><body>');
    // w.document.write(`
    // <div class="container">
    //     <div class="row">
    //         <div class="col-12 text-center">
    //         <a href="javascript:;"  onclick="window.print()">Print</a>
    //         </div>
    //     </div>
    // </div>
    // `);
    // w.document.write(printContent.innerHTML);
    // w.document.write('</body></html>');
    // // w.print();
    // w.document.close();
  }

  saveBillToDb() {
    
  }

}
