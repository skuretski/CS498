import { MainService } from './../../main.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  title: string = 'Support Breakdown';
  support_stats: any;

  constructor(public ms: MainService) { }

  async ngOnInit() {
    let my_set = new Set();

    let my_func = (acc, curr) => {
      acc.add(curr['stat_name']);
      return acc;
    }
    this.support_stats = [...this.ms.support.reduce(my_func,my_set)];
  }

}
