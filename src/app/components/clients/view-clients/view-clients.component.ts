import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ClientsService } from 'src/app/services/clients.service';

@Component({
  selector: 'app-view-clients',
  templateUrl: './view-clients.component.html',
  styleUrls: ['./view-clients.component.css']
})
export class ViewClientsComponent implements OnInit {
  
  displayedColumns: string[] = ['clientName', 'mobile', 'storeName','city', 'action'];
  dataSource = new MatTableDataSource();
  
  @Output() createNewBill = new EventEmitter<boolean>();

  initialSelection = [];

  doFilter(searchString) {
    this.dataSource.filter = searchString.trim().toLocaleLowerCase();
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private clientsService: ClientsService, private router: Router) { }

  ngOnInit(): void {
    this.clientsService.getAllClients().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  onNewBillClick(clientId: number) {
    if(clientId) {
      this.router.navigate(["new-bill"], { state: { clientId: clientId } })
    }
  }

}
