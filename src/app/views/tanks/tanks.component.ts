import { MainService } from './../../main.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tanks',
  templateUrl: './tanks.component.html',
  styleUrls: ['./tanks.component.scss']
})
export class TanksComponent implements OnInit {
  title: string = 'Tank Breakdown';
  tank_stats: any;

  constructor(public ms: MainService) { }

  async ngOnInit() {
    let my_set = new Set();

    let my_func = (acc, curr) => {
      acc.add(curr['stat_name']);
      return acc;
    }
    this.tank_stats = [...this.ms.tanks.reduce(my_func,my_set)];
  }

}
