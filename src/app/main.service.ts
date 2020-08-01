import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  support_data: {
    teams: any,
    stages: any,
    seasons: any
  }

  // Data for viz
  records: any;
  tanks: any;
  support: any;
  dps: any;

  constructor() {}

  async init() {
    [
      this.records,
      this.tanks,
      this.support,
      this.dps
    ] = await Promise.all([
      d3.csv('/data/match_map_stats/records.csv'),
      d3.csv('/data/player_stats/tanks.csv'),
      d3.csv('/data/player_stats/support.csv'),
      d3.csv('/data/player_stats/dps.csv')
    ]);

    let my_obj = {
      teams: new Set(),
      stages: new Set(),
      seasons: new Set(),
    }

    let my_func = (acc, curr) => {
      acc.teams.add(curr['match_loser']);
      acc.teams.add(curr['match_winner']);
      acc.stages.add(curr['stage']);
      acc.seasons.add(curr['season']);
      return acc;
    }
    this.support_data = this.records.reduce(my_func,my_obj);
    this.support_data.teams = Array.from(this.support_data.teams).sort();
    this.support_data.stages = Array.from(this.support_data.stages).sort();
    this.support_data.seasons = Array.from(this.support_data.seasons).sort();
  }

}
