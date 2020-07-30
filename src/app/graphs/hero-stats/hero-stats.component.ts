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
      }
    }
  _data:any;

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

  width: number = 1064 - this.margin.left - this.margin.right;
  height: number = 564 - this.margin.top - this.margin.bottom;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.svg = d3.select("#heroviz")
    .append("svg")
    .attr("viewBox", `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top  + this.margin.bottom + 100}`)
    this.buildInitialChart();
  }

  buildInitialChart() {

  }
}
