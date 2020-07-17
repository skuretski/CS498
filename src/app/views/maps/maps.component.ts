import { MainService } from '../../main.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  title: string = 'Map Breakdown';

  constructor(public ms: MainService) { }

  ngOnInit() {
  }

}
