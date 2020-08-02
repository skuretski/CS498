import { MainService } from './../../main.service';
import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-hero-stats',
  templateUrl: './hero-stats.component.html',
  styleUrls: ['./hero-stats.component.scss']
})
export class HeroStatsComponent implements OnInit {
  @Input() title:string;
  @Input()
    get data() {
      return this._data;
    }
    set data(d: any) {
      if(d != undefined) {
        this.original_data = d;
        this._data = d;
        let my_set = new Set();

        let my_func = (acc, curr) => {
          acc.add(curr['stat_name']);
          return acc;
        }
        this.stats = [...this._data.reduce(my_func,my_set)];
      }
    }
  _data:any;

  stats: string[];
  original_data: any;
  active_filters = {
    season: 1,
    stat_name: null
  }
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
  color: any;

  width: number = 800 - this.margin.left - this.margin.right;
  height: number = 400 - this.margin.top - this.margin.bottom;

  teams_ranks: {} = {
    one: {
      top: ['New York Excelsior', 'Los Angeles Valiant', 'Boston Uprising'],
      bottom: ['Shanghai Dragons', 'Florida Mayhem', 'Dallas Fuel']
    },
    two: {
      top: ['Vancouver Titans', 'San Francisco Shock', 'New York Excelsior'],
      bottom: ['Florida Mayhem', 'Boston Uprising', 'Washington Justice']
    },
    three: {
      top: ['Shanghai Dragons', 'Philadelphia Fusion', 'San Francisco Shock'],
      bottom: ['Boston Uprising', 'Washington Justice', 'Vancouver Titans']
    }
  }

  constructor(public ms: MainService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.svg = d3.select("#heroviz")
    .append("svg")
    .attr("viewBox", `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top  + this.margin.bottom + 100}`)
    this.filter('season', 1);
  }

  formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  season_filter = (val) => {
    return val['season'] == this.active_filters.season;
  }

  stat_filter = (val) => {
    if(this.active_filters.stat_name == null) return true;
    return val['stat_name'] == this.active_filters.stat_name;
  }
  
  filterAll = (val) => {
    return this.season_filter(val) && this.stat_filter(val);
  }

  filter(key_name: string, val: any) {
    if(key_name == null) {
      Object.keys(this.active_filters).forEach(v => this.active_filters[v] = null);
    } else {
      this.active_filters[key_name] = val;
    }

    let data = this.original_data.filter(this.filterAll);
    this._data = data;
    this.buildScatterPlot();
  }

  buildScatterPlot() {
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

    this.color = d3.scaleOrdinal()
      .domain(this.stats)
      .range(d3.schemeTableau10)

    this.x = d3.scaleBand()
      .domain(this.ms.support_data.teams.map((t) => t))
      .range([0, this.width])

    if(this.active_filters.stat_name) {
      let min = d3.min(this._data, d => Number(d['adjusted_stat_amount']));
      this.y = d3.scaleLinear()
      .range([this.height, 0])
      .domain([Math.max(min - (min * 0.1), 0), d3.max(this._data, d => Number(d['adjusted_stat_amount']))]);
    } else {
      this.y = d3.scaleSymlog()
      .range([this.height, 0])
      .domain([0, d3.max(this._data, d => Number(d['adjusted_stat_amount']))]);
    }

    if(this.active_filters.stat_name) {
      this.y_axis = d3.axisLeft(this.y)
      .tickFormat(d3.format("~s"));
    } else {
      this.y_axis = d3.axisLeft(this.y)
        .tickFormat(d3.format("~s"))
        .tickValues([0, 10, 100, 1000, 10000, 15000])
        .ticks(6)
    }

    this.svg.selectAll("*").remove();

    this.svg.append("g")
      .attr("transform", `translate(${this.margin.left},${this.height + this.margin.top})`)
      .call(d3.axisBottom(this.x))
      .selectAll("text")
      .attr("font-size", "11px")
      .attr("transform", "translate(0,12)rotate(-90)")
      .style("text-anchor", "end");
    this.svg.append("g")
      .attr("class", "y")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .call(this.y_axis)

    this.svg.append("g")
      .selectAll("dot")
      .data(this._data)
      .enter()
      .append("circle")
      .on("mouseover", (d) => {
        d3.select("#tooltip")
          .style("opacity", 0.9)
          .append("p")
          .style("margin-bottom", 0)
          .attr("id", "tooltip-text")
          .text(`Team: ${d.team}`)
          .append("p")
          .style("margin-bottom", 0)
          .attr("id", "tooltip-text")
          .text(`${d.stat_name}: ${this.formatNumber(parseFloat(d.adjusted_stat_amount).toFixed(2))}`)
          .append("p")
          .style("margin-bottom", 0)
          .attr("id", "tooltip-text")
          .text(`Season: ${d.season}`)
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

      .attr("cx", (d) => {
        if(d['stat_name'] != 'Time Played') {
          return this.x(d['team']) + this.margin.left + this.margin.right
        }
      })
      .attr("cy", (d) => {
        if(d['stat_name'] != 'Time Played') {
          return this.y(d['adjusted_stat_amount']) + this.margin.top
        }
      })
      .attr("r", (d) => {
        if(d['stat_name'] != 'Time Played') {
          return 8
        }
      })
      .style("fill", (d) => {
        if(d['stat_name'] != 'Time Played') {
          return this.color(d['stat_name'])
        }
      })
      .style("stroke", (d) => {
        if(this.active_filters.season == 1) {
          if(this.teams_ranks['one']['top'].includes(d['team'])) {
            return "green";
          } else if(this.teams_ranks['one']['bottom'].includes(d['team'])) {
            return "red";
          }
        } else if(this.active_filters.season == 2) {
          if(this.teams_ranks['two']['top'].includes(d['team'])) {
            return "green";
          } else if(this.teams_ranks['two']['bottom'].includes(d['team'])) {
            return "red";
          }
        } else if(this.active_filters.season == 3) {
          if(this.teams_ranks['three']['top'].includes(d['team'])) {
            return "green";
          } else if(this.teams_ranks['three']['bottom'].includes(d['team'])) {
            return "red";
          }
        }
      })
      .style("stroke-width", (d) => {
        return 2;
      })
  }

}
