import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { DSVRowArray } from 'd3';

@Component({
  selector: 'app-map-stats',
  templateUrl: './map-stats.component.html',
  styleUrls: ['./map-stats.component.scss']
})
export class MapStatsComponent implements OnInit {
  @ViewChild('my_viz', { static: false} ) my_viz;

  @Input() year: number;
  @Input() stage: number;

  map_stats_2018: MapStat[];
  map_stats_2019: MapStat[];
  map_stats_2020: MapStat[];
  all_map_stats: MapStat[];
  map_names: string[];
  data: any;

  // d3 Variables
  svg: any;
  margin: { top: number, right: number, bottom: number, left: number} = {
    top: 32, 
    right: 32, 
    bottom: 32, 
    left: 32
  };

  width: number = 1064 - this.margin.left - this.margin.right;
  height: number = 564 - this.margin.top - this.margin.bottom;
  
  constructor() { }

  ngAfterViewInit() {
    this.svg = d3.select("#mapviz")
    .append("svg")
    .attr("viewBox", `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top  + this.margin.bottom}`)
  }

  async ngOnInit() {
    this.data = await d3.csv('/data/match_map_stats/all_maps_played_counts.csv');
    // let one, two, three, four;  // Because we can't have d3 data assigned directly to a typed variable. We can't have nice things.
    // [
    //   one,
    //   two,
    //   three,
    //   four
    // ] = await Promise.all([
    //   d3.csv('/data/match_map_stats/2018_match_map_stats.csv'),
    //   d3.csv('/data/match_map_stats/2019_match_map_stats.csv'),
    //   d3.csv('/data/match_map_stats/2020_match_map_stats.csv'),
    //   d3.csv('/data/match_map_stats/match_map_stats.csv'),
    // ]);
    // this.map_stats_2018 = one;
    // this.map_stats_2019 = two;
    // this.map_stats_2020 = three;
    // this.all_map_stats = four;
    this.buildBarChart();
  }

  buildBarChart():void {  
    let x = d3.scaleBand()
      .range([0,this.width])
      .domain(this.data.map((d) => { return d.map_name}))
      .padding(0.2);

    let y = d3.scaleLinear()
      .domain([0,600])
      .range([this.height, 0])

    let y_axis = d3.axisLeft(y)
      .tickValues([0,100,200,300,400,500,600])
      .tickFormat(d3.format("~s"))

    this.svg.append("g")
      .attr("transform", `translate(${this.margin.left},${this.height + this.margin.top})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-14,12)rotate(-90)")
      .style("text-anchor", "end");
    this.svg.append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .call(y_axis)
      
    this.svg.append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.margin.bottom})`)
      .selectAll().data(this.data)
      .enter().append("rect")
      .attr("x", (d) => {
        return x(d.map_name)
      })
      .attr("y", (d) => { return y(d.match_count)})
      .attr("width", x.bandwidth())
      .attr("height", (d) => {
        return this.height - y(d.match_count) - this.margin.top
      })
      .attr("fill", '#69b3a2')
  }
}



export class MapStat {
  round_start_time: Date;
  round_end_time: Date;
  stage: string;
  match_id: number;
  game_number: number;
  match_winner: string;
  map_winner: string;
  map_loser: string;
  map_name: string;
  map_round: number;
  winning_team_final_map_score: number;
  losing_team_final_map_score: number;
  control_round_name: string;
  attacker: string;
  defender: string;
  team_one_name: string;
  team_two_name: string;
  attacker_payload_distance: number;
  defender_payload_distance: number;
  attacker_time_banked: number;
  defender_time_banked: number;
  attacker_control_percent: number;
  defender_control_percent: number;
  attacker_round_end_score: number;
  defender_round_end_score: number;
  constructor() {
  }
}

