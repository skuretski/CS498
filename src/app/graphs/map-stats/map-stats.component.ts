import { MainService } from './../../main.service';
import { RecordData } from './../../class';
import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-map-stats',
  templateUrl: './map-stats.component.html',
  styleUrls: ['./map-stats.component.scss']
})
export class MapStatsComponent implements OnInit {
  @Input()
    get data() { 
      return this._data;
    }
    set data(d: RecordData) {
      if(d != undefined) {
        this.original_data = d;
        this.subgroups = ['losses', 'wins'];
        this.groups = this.ms.support_data.teams;
        this._data = this.filterData(d, 'season', 1);
        let data = this.countWinLoss(this._data);
        this.stacked_data = d3.stack().keys(this.subgroups)(data);
      }
    }
    _data: any;

  @Input() title: string;

  stacked_data: any;
  original_data: any;
  groups: any;
  subgroups: any;
  max_wins: any;
  max_losses: any;

  // d3 Variables
  svg: any;
  margin: { top: number, right: number, bottom: number, left: number} = {
    top: 32,
    right: 32,
    bottom: 32,
    left: 32
  };

  x: any;
  y: any;
  y_axis: any;
  color_scale: any;

  width: number =  800 - this.margin.left - this.margin.right;
  height: number = 400 - this.margin.top - this.margin.bottom;

  // UI Variables
  active_filters = {
    team: null,
    stage: null,
    season: 1
  }

  currentPage = 1;

  countWinLoss(d: any) {
    let new_data = [];
    d.forEach((d) => {
      const isWinner = (e) => e == d.match_winner;
      const isLoser = (e) => e == d.match_loser;
      let winner_idx = this.ms.support_data.teams.findIndex(isWinner);
      let loser_idx = this.ms.support_data.teams.findIndex(isLoser);
      if(!new_data[winner_idx]) {
        new_data[winner_idx] = {team: this.ms.support_data.teams[winner_idx], wins: 0, losses: 0};
      }
      if(!new_data[loser_idx]) {
        new_data[loser_idx] = {team: this.ms.support_data.teams[loser_idx], wins: 0, losses: 0};
      }
      new_data[winner_idx].wins++;
      new_data[loser_idx].losses++;
    });
    for(let i = 0; i < new_data.length; i++) {
      if(new_data[i] == undefined) {
        new_data[i] = {team: this.ms.support_data.teams[i], wins: 0, losses: 0}
      }
    }
    return new_data;
  }

  match_by_stage = (v) => {
    if(this.active_filters.stage == null) return true;

    return v['stage'] == this.active_filters.stage;
  }
  match_by_season = (v) => {
    if(this.active_filters.season == null) return true;

    return v['season'] == this.active_filters.season;
  }

  constructor(public ms: MainService) {}

  ngAfterViewInit() {
    this.svg = d3.select("#mapviz")
    .append("svg")
    .attr("viewBox", `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top  + this.margin.bottom + 100}`)
    this.buildBarChart();
  }
  
  ngOnInit() { }

  buildBarChart():void {
    // Tooltip
    let tooltip = d3.select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("z-index", 10)
      .style("background-color", "#405275")
      .style("color", "#fff")
      .style("border-radius", "0.5rem")
      .style("padding", "0.5rem")

    // x scale
    this.x = d3.scaleBand()
      .range([0,this.width])
      .padding(0.2)
      .domain(this.groups);

    d3.max(this.stacked_data, (d:any,i:any) => {
      let max_win = 0, max_loss = 0, max_win_team = null, max_loss_team = null, offset = 0;
      if(i === 0) {
        d.map(x => {
          if(x[1] > max_loss) {
            max_loss = x[1];
            max_loss_team = x.data.team;
            offset = x.data.wins + x.data.losses;
          }
        });
        this.max_losses = {
          count: max_loss,
          team: max_loss_team,
          offset
        }
      } 
      else if (i === 1) {
        d.map(x => {
          if((x[1] - x[0]) > max_win) {
            max_win = x[1] - x[0];
            max_win_team = x.data.team;
            offset = x.data.wins + x.data.losses;
          }
        });
        this.max_wins = {
          count: max_win,
          team: max_win_team,
          offset
        }
      }
      return '';
    })

    // y scale
    this.y = d3.scaleLinear()
      .range([this.height, 0])
      //@ts-ignore
      .domain([0, d3.max(this.stacked_data, d => d3.max(d, d => parseInt(d[1])))])

    // y axis
    this.y_axis = d3.axisLeft(this.y)
      .tickFormat(d3.format("~s"));

    // Colors
    this.color_scale = d3.scaleOrdinal()
      .domain(this.subgroups)
      .range(d3.schemeTableau10)
    this.svg.selectAll("*").remove();
    // Skeleton graph
    this.svg.append("g")
      .attr("transform", `translate(${this.margin.left},${this.height + this.margin.top})`)
      .call(d3.axisBottom(this.x))
      .selectAll("text")
      .attr("font-size", "11px")
      .attr("transform", "translate(-14,12)rotate(-90)")
      .style("text-anchor", "end");
    this.svg.append("g")
      .attr("class", "y")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .call(this.y_axis)

    // Add Bars
    this.svg.append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.margin.bottom})`)
      .selectAll("g")
      .data(this.stacked_data)
      .enter().append("g")
      .attr("fill", (d) => this.color_scale(d.key))
      .selectAll("rect")
      .data((d) => d)
        .enter().append("rect")
        .attr("id", "bars")
        .style("fill-opacity", "0.8")
      
        // Tooltips
        .on("mouseover", (d) => {
          d3.select("#tooltip")
            .style("opacity", 0.9)
            .append("p")
            .style("margin-bottom", 0)
            .attr("id", "tooltip-text")
            .text(`Team: ${d.data.team}`)
            .append("p")
            .style("margin-bottom", 0)
            .attr("id", "tooltip-text")
            .text(`Wins: ${d.data.wins}`)
            .append("p")
            .style("margin-bottom", 0)
            .attr("id", "tooltip-text")
            .text(`Losses: ${d.data.losses}`)
        })
        .on("mousemove", () => {
          d3.select("#tooltip")
            .style("top", (d3.event.pageY-10)+"px")
            .style("left",(d3.event.pageX+10)+"px");
        })
        .on('mouseout', () => {
          d3.select('#tooltip').style('opacity', 0)
          d3.select("#tooltip-text").remove()
        })

        // Place bars
        .attr("x", (d, i) => {
          return this.x(d.data.team)
        })
        .attr("y", (d) => { return this.y(0)})
        .attr("width", this.x.bandwidth())
        .attr("height", (d) => {
          return 0
        })
        .attr("transform", `translate(0, -${this.margin.top})`)
        // .attr("fill", (d,i) => {
        //   return color_scale(i)
        // })

        // Transition bars in
        this.svg.selectAll("rect")
          .transition()
          .duration(800)
          .attr("y", (d) => { 
            return this.y(d[1])
          })
          .attr("height", (d) => {
            return this.y(d[0]) - this.y(d[1]);
          })

        this.svg
          .append("text")
          .attr("x", this.x(this.max_wins.team) + this.margin.left)
          .attr("y", this.y(this.max_wins.offset) + 24)
          .attr("width", 20)
          .text(`Most wins: ${this.max_wins.team}`)
          .attr("fill", "#000000")
          .attr("font-size", "12px")

        this.svg
          .append("text")
          .attr("x", this.x(this.max_losses.team) + this.margin.left)
          .attr("y", this.y(this.max_losses.offset) + 24)
          .attr("width", 20)
          .text(`Most losses: ${this.max_losses.team}`)
          .attr("fill", "#000000")
          .attr("font-size", "12px")
  }

  filterData(d: any, key_name, value) {
    let data;
    if(key_name == null) {
      Object.keys(this.active_filters).forEach(v => this.active_filters[v] = null);
    } else {
      this.active_filters[key_name] = value;
    }
    // Preprocess data
    const filter_all = (val) => {
      return this.match_by_season(val) && this.match_by_stage(val);
    }

    data = d.filter(filter_all);
    return data;
  }

  update(key_name: string, value: any):void {
    if(key_name == null) {
      Object.keys(this.active_filters).forEach(v => this.active_filters[v] = null);
    } else {
      this.active_filters[key_name] = value;
    }
    // Preprocess data
    const filter_all = (val) => {
      return this.match_by_season(val) && this.match_by_stage(val);
    }
    this._data = this.original_data.filter(filter_all);
    let data = this.countWinLoss(this._data);
    this.stacked_data = d3.stack().keys(this.subgroups)(data);

    this.buildBarChart();
  }
}
