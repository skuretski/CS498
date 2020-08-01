import { MainService } from '../../main.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  title: string = 'Team Win/Loss Records';

  constructor(public ms: MainService) { }

  ngOnInit() {
  }

}
