import { MainService } from './../../main.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tanks',
  templateUrl: './tanks.component.html',
  styleUrls: ['./tanks.component.scss']
})
export class TanksComponent implements OnInit {
  title: string = 'Tank Breakdown';

  constructor(public ms: MainService) { }

  ngOnInit() {

  }

}
