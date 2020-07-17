import { MainService } from '../../main.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-seasons',
  templateUrl: './all-seasons.component.html',
  styleUrls: ['./all-seasons.component.scss']
})
export class AllSeasonsComponent implements OnInit {
  title: string = 'Map Breakdown';

  constructor(public ms: MainService) { }

  ngOnInit() {
  }

}
