import { MapData } from './class';
import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  support_data: {
    maps: any,
    teams: any,
    map_types: any,
    stages: any,
    seasons: any
  }

  // Data for viz
  map_data: any;

  constructor() {}

  async init() {
    this.map_data = await d3.csv('/data/match_map_stats/all_maps_played_counts.csv');

    let my_obj = {
     // data: {},
      maps: new Set(),
      teams: new Set(),
      map_types: new Set(),
      stages: new Set(),
      seasons: new Set()
    }

    let my_func = (acc, curr) => {
      acc.maps.add(curr['map_name']);
      acc.teams.add(curr['map_loser']);
      acc.teams.add(curr['map_winner']);
      acc.map_types.add(curr['map_type']);
      acc.stages.add(curr['stage']);
      acc.seasons.add(curr['season']);
      return acc;
    }
    this.support_data = this.map_data.reduce(my_func,my_obj);
    this.support_data.maps = Array.from(this.support_data.maps).sort();
    this.support_data.teams = Array.from(this.support_data.teams).sort();
    this.support_data.map_types = Array.from(this.support_data.map_types).sort();
    this.support_data.maps = Array.from(this.support_data.maps).sort();
    this.support_data.stages = Array.from(this.support_data.stages).sort();
    this.support_data.seasons = Array.from(this.support_data.seasons).sort();
  }
}
