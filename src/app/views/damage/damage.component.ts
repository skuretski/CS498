import { MainService } from './../../main.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-damage',
  templateUrl: './damage.component.html',
  styleUrls: ['./damage.component.scss']
})
export class DamageComponent implements OnInit {
  title: string = 'Damage Breakdown';
  damage_stats: any;

  constructor(public ms: MainService) { }

  async ngOnInit() {
    let my_set = new Set();

    let my_func = (acc, curr) => {
      acc.add(curr['stat_name']);
      return acc;
    }
    this.damage_stats = [...this.ms.dps.reduce(my_func,my_set)];
  }


}
