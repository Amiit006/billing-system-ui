import { Component, OnInit } from '@angular/core';
import { ClientsService } from 'src/app/services/clients.service';

@Component({
  selector: 'app-view-clients',
  templateUrl: './view-clients.component.html',
  styleUrls: ['./view-clients.component.css']
})
export class ViewClientsComponent implements OnInit {

  constructor(private clientsService: ClientsService) { }

  ngOnInit(): void {
    this.clientsService.getAllParticulars().subscribe(data => {
      console.log(data);
    })
  }

}
