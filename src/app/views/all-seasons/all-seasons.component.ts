import { MapData } from './../../class';
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-all-seasons',
  templateUrl: './all-seasons.component.html',
  styleUrls: ['./all-seasons.component.scss']
})
export class AllSeasonsComponent implements OnInit {
  data: any;
  title: string = 'Number of times each map has been played (All seasons)';

  constructor() { }

  async ngOnInit() {
    this.data = await d3.csv('/data/match_map_stats/all_maps_played_counts.csv');
    console.log(this.data[0])
  }

}
