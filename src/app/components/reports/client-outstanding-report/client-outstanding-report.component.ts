import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ChartResponse } from 'src/app/model/chart-response.model';
import { TableResult } from 'src/app/model/table-result.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ReportService } from 'src/app/services/report.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-client-outstanding-report',
  templateUrl: './client-outstanding-report.component.html',
  styleUrls: ['./client-outstanding-report.component.css'],
})
export class ClientOutstandingReportComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  displayedColumns: string[] = [
    'slNo',
    'clientName',
    'purchasedAmount',
    'paymentAmount',
    'outstandingAmount',
  ];
  displayedColumnsValue: string[] = [
    'Sl No',
    'Client',
    'Purchased',
    'Payment',
    'Outstanding',
  ];

  dataSource = new MatTableDataSource<TableResult>([]);
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  reportStatus: 'loading' | 'loaded' = 'loading';

  // ngx-charts
  single: ChartResponse[] = [];
  view: [number, number] = [1100, 240];
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
  };
  cardColor: string = '#232837';

  // responsive
  isHandset = false;
  pageSize = 20;
  private bpSub?: Subscription;

  // chart container + resize observer
  @ViewChild('chartContainer', { static: true })
  chartContainer!: ElementRef<HTMLDivElement>;
  private resizeObs?: ResizeObserver;

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private dashboardService: DashboardService,
    private bp: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.getData();

    // watch breakpoints
    this.bpSub = this.bp
      .observe([Breakpoints.Handset, '(max-width: 768px)'])
      .subscribe((state) => {
        this.isHandset = state.matches;
        this.pageSize = this.isHandset ? 20 : 20; // keep same size; paginator hidden on mobile anyway
        // adjust chart height on breakpoint switch
        const w =
          this.chartContainer?.nativeElement.getBoundingClientRect().width ||
          1100;
        this.updateView(Math.floor(w));
      });
  }

  ngAfterViewInit(): void {
    // hook sort/paginator
    this.dataSource.sort = this.sort;
    if (this.paginator) this.dataSource.paginator = this.paginator;

    // observe the chart container size
    this.resizeObs = new ResizeObserver((entries) => {
      for (const e of entries) {
        const width = Math.floor(e.contentRect.width);
        this.updateView(width);
      }
    });
    this.resizeObs.observe(this.chartContainer.nativeElement);

    // initial sizing
    const initialWidth = Math.floor(
      this.chartContainer.nativeElement.getBoundingClientRect().width || 1100
    );
    this.updateView(initialWidth);
  }

  ngOnDestroy(): void {
    this.resizeObs?.disconnect();
    this.bpSub?.unsubscribe();
  }

  mobileSort: {
    active: 'clientName' | 'outstandingAmount';
    direction: 'asc' | 'desc';
  } = {
    active: 'outstandingAmount',
    direction: 'desc',
  };

  sortMobileBy(col: 'clientName' | 'outstandingAmount') {
    if (this.mobileSort.active === col) {
      this.mobileSort.direction =
        this.mobileSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.mobileSort.active = col;
      this.mobileSort.direction = col === 'clientName' ? 'asc' : 'desc';
    }
    const dir = this.mobileSort.direction === 'asc' ? 1 : -1;
    // clone to trigger change detection
    const arr = [...(this.dataSource.data as any[])];
    arr.sort((a, b) => {
      const av = a[col] ?? '';
      const bv = b[col] ?? '';
      if (typeof av === 'number' && typeof bv === 'number')
        return (av - bv) * dir;
      return av.toString().localeCompare(bv.toString()) * dir;
    });
    this.dataSource.data = arr as any;
  }

  private updateView(containerWidth: number): void {
    const minW = 320;
    const width = Math.max(minW, containerWidth);
    const height = this.isHandset ? 420 : 240;
    this.view = [width, height];
  }

  getData() {
    return this.reportService.getClientOutstandingReport().subscribe((data) => {
      this.dataSource = new MatTableDataSource<TableResult>(
        data?.clientOutstandingAmount || []
      );
      this.dataSource.sort = this.sort;
      if (this.paginator) this.dataSource.paginator = this.paginator;

      this.single = data?.clientOutstandingAmountSummary || [];
      this.reportStatus = 'loaded';
    });
  }

  downloadFile(data: any[]) {
    if (!data || !data.length) return;
    const replacer = (key: string, value: any) => (value === null ? '' : value);
    const header = Object.keys(data[0] || {});
    const csv = [
      header.join(','),
      ...data.map((row) =>
        header
          .map((fieldName) => JSON.stringify((row as any)[fieldName], replacer))
          .join(',')
      ),
    ].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    // @ts-ignore: FileSaver assumed imported globally (saveAs)
    saveAs(
      blob,
      'collection_report_' +
        moment(new Date()).format('yyyy-MM-DD-HH-mm-ss') +
        '.csv'
    );
  }
}
