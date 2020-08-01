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
        this.filterBySeason(this._data, 1);
      }
    }
  _data:any;
  @Input() stats: string[];

  original_data: any;
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

  constructor(public ms: MainService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.svg = d3.select("#heroviz")
    .append("svg")
    .attr("viewBox", `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top  + this.margin.bottom + 100}`)
    this.buildInitialChart();
  }

  formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  filterBySeason(d: any, season: number) {
    let filter = (val) => {
      return val['season'] == season;
    }

    let data = d.filter(filter);
    this._data = data;
  }

  buildInitialChart() {
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

    this.y = d3.scaleSymlog()
      .range([this.height, 0])
      .domain([0, d3.max(this._data, d => parseInt(d['adjusted_stat_amount']) + 20000)]);
    
    this.y_axis = d3.axisLeft(this.y)
      //.ticks(10)
      .tickValues([10, 100, 1000, 5000, 10000, 20000])
      .tickFormat(d3.format("~s"));
    
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
          .text(`${d.stat_name}: ${this.formatNumber(Math.trunc(d.adjusted_stat_amount))}`)
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
  }
}
