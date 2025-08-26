import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ClientsService } from 'src/app/services/clients.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-clients',
  templateUrl: './view-clients.component.html',
  styleUrls: ['./view-clients.component.css']
})
export class ViewClientsComponent implements OnInit {

  displayedColumns: string[] = ['clientName', 'mobile', 'storeName','city', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  isHandset$: Observable<boolean>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private clientsService: ClientsService,
    private router: Router,
    private bp: BreakpointObserver
  ) {
    this.isHandset$ = this.bp.observe([Breakpoints.Handset])
      .pipe(map(r => r.matches), shareReplay(1));
  }

  ngOnInit(): void {
    this.clientsService.getAllClients().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (d, f) =>
        (d.clientName + ' ' + d.mobile + ' ' + d.address?.storeName + ' ' + d.address?.city)
          .toLowerCase()
          .includes((f || '').trim().toLowerCase());
    });
  }

  doFilter(value: string) {
    this.dataSource.filter = (value || '').trim().toLowerCase();
  }

  onNewBillClick(clientId: number) {
    if (clientId) this.router.navigate(['new-bill'], { state: { clientId } });
  }
}
