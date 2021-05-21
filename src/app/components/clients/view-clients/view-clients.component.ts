import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ClientsService } from 'src/app/services/clients.service';

@Component({
  selector: 'app-view-clients',
  templateUrl: './view-clients.component.html',
  styleUrls: ['./view-clients.component.css']
})
export class ViewClientsComponent implements OnInit {
  
  displayedColumns: string[] = ['clientName', 'mobile', 'storeName','city', 'action'];
  dataSource = new MatTableDataSource();

  initialSelection = [];
  allowMultiSelect = true;
  election = new SelectionModel(this.allowMultiSelect, this.initialSelection);

  doFilter(searchString) {
    this.dataSource.filter = searchString.trim().toLocaleLowerCase();
  }

  @ViewChild(MatSort) sort: MatSort;

  constructor(private clientsService: ClientsService) { }

  ngOnInit(): void {
    this.clientsService.getAllParticulars().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    })
  }

}
