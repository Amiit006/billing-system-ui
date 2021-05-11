import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Particulars } from 'src/app/model/particulars.model';
import { ParticularsService } from 'src/app/services/particulars.service';

@Component({
  selector: 'app-view-particulars',
  templateUrl: './view-particulars.component.html',
  styleUrls: ['./view-particulars.component.css']
})
export class ViewParticularsComponent implements OnInit {

  constructor(public particularsService: ParticularsService) { }

  displayedColumns: string[] = ['select', 'id', 'particulars', 'action'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;

  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel(this.allowMultiSelect, this.initialSelection);

  ngOnInit(): void {
    this.particularsService.getAllParticulars().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    });
  }

  doFilter(searchString) {
    this.dataSource.filter = searchString.trim().toLocaleLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  onSingleDelete(id) {
    console.log(id);
  }

  onMultiDelete() {
    var selectedIds = [];
    this.selection.selected.map(data => {
      selectedIds.push(data.id);
    });
    console.log(selectedIds);
  }
}
