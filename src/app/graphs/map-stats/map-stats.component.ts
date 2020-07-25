import { MainService } from './../../main.service';
import { MapData } from './../../class';
import { Component, OnInit, Input, ViewChild, ModuleWithComponentFactories } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-map-stats',
  templateUrl: './map-stats.component.html',
  styleUrls: ['./map-stats.component.scss']
})
export class MapStatsComponent implements OnInit {
  @ViewChild('my_viz', { static: false} ) my_viz;

  @Input()
    get data() { 
      return this._data; 
    }
    set data(d: any) {
      if(d != undefined) {
        this.original_data = d;
        this._data = d3.nest()
          .key((d:MapData) => {
            return d.map_name;
          })
          .rollup((values) => {
            return d3.sum(values, (x:MapData) => x.match_count) as any
          })
          .sortKeys(d3.ascending)
          .entries(d)
      }
    }
    _data: any;
  @Input() title: string;

  original_data: any;

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

  width: number = 1064 - this.margin.left - this.margin.right;
  height: number = 564 - this.margin.top - this.margin.bottom;

  // UI Variables
  active_filters = {
    team: null,
    map_type: null,
    stage: null,
    season: null
  }

  constructor(public ms: MainService) {

  }

  ngAfterViewInit() {
    this.svg = d3.select("#mapviz")
    .append("svg")
    .attr("viewBox", `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top  + this.margin.bottom + 100}`)
    this.buildInitialBarChart();
  }

  ngOnInit() { }

  buildInitialBarChart():void {
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
      .domain(this._data.map((d) => {
        return d['key']})
      );

    // y scale
    this.y = d3.scaleLinear()
      .range([this.height, 0])
      .domain([0, d3.max(this._data, (d) => {
        return parseInt(d['value'])
      })])

    // y axis
    this.y_axis = d3.axisLeft(this.y)
      .tickFormat(d3.format("~s"))
    
    // Colors
    //let colors = d3.scaleLinear().domain([0, 600]).range(['red', 'blue']);
    let color_scale = d3.scaleOrdinal(d3.schemeTableau10);

    // Skeleton graph
    this.svg.append("g")
      .attr("transform", `translate(${this.margin.left},${this.height + this.margin.top})`)
      .call(d3.axisBottom(this.x))
      .selectAll("text")
      .attr("font-size", "12px")
      .attr("transform", "translate(-14,12)rotate(-90)")
      .style("text-anchor", "end");
    this.svg.append("g")
      .attr("class", "y")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .call(this.y_axis)

    // Add Bars
    this.svg.append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.margin.bottom})`)
      .selectAll().data(this._data)
      .enter().append("rect")
      .style("fill-opacity", "0.8")
      
      // Tooltips
      .on("mouseover", (d) => {
        d3.select("#tooltip")
          .style("opacity", 0.9)
          .append("p")
          .style("margin-bottom", 0)
          .attr("id", "tooltip-text")
          .text(`Map name: ${d['key']}`)
          .append("p")
          .style("margin-bottom", 0)
          .attr("id", "tooltip-text")
          .text(`Count: ${typeof d['value'] == "number" ? d['value'] : d['value']['values']}`)
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
      .attr("x", (d) => {
        return this.x(d['key'])
      })
      .attr("y", (d) => { return this.y(0)})
      .attr("width", this.x.bandwidth())
      .attr("height", (d) => {
        return 0
      })
      .attr("transform", `translate(0, -${this.margin.top})`)
      .attr("fill", (d,i) => {
        return color_scale(i)
      })

    // Transition bars in
    this.svg.selectAll("rect")
      .transition()
      .duration(800)
      .attr("y", (d) => { return this.y(d['value'])})
      .attr("height", (d) => {
        return this.height - this.y(d['value'])
      })
      .delay((d,i) => { return(i*50) })
  }

  update(key_name: string, value: any):void {
    if(key_name == null) {
      Object.keys(this.active_filters).forEach(v => this.active_filters[v] = null);
    } else {
      this.active_filters[key_name] = value;
    }
    // Preprocess data
    const match_by_team = (v) => {
      if(this.active_filters.team == null) return true;
      return v['map_winner'] == this.active_filters.team || v['map_loser'] == this.active_filters.team;
    }
    const match_by_stage = (v) => {
      if(this.active_filters.stage == null) return true;
      return v['stage'] == this.active_filters.stage;

    }
    const match_by_season = (v) => {
      if(this.active_filters.season == null) return true;
      return v['season'] == this.active_filters.season;

    }
    const match_by_map_type = (v) => {
      if(this.active_filters.map_type == null) return true;
      return v['map_type'] == this.active_filters.map_type;
    }
    const filter_all = (val) => {
      return match_by_map_type(val) && match_by_season(val) && match_by_stage(val) && match_by_team(val);
    }
    let winner, loser;

    this._data = d3.nest()
    .key((d:MapData) => d.map_name)
    .rollup((values:any) => {
      const filter = values.filter(filter_all);
      winner = filter.filter((f) => { return this.active_filters.team == f['map_winner']});
      loser = filter.filter((f) => { return this.active_filters.team == f['map_loser']});
      return {
        values: d3.sum(filter, (x:MapData) => x.match_count) as any,
        winner: d3.sum(winner, (x:MapData) => x.match_count) as any,
        loser: d3.sum(loser, (x:MapData) => x.match_count) as any,
      }
    })
    .sortKeys(d3.ascending)
    .entries(this.original_data);

    // Change the y axis
    this.y = d3.scaleLinear()
      .range([this.height, 0])
      .domain([0, d3.max(this._data, (d) => {
        return parseInt(d['value']['values'])
      })])
    this.y_axis = d3.axisLeft(this.y)
    .tickFormat(d3.format("~s"))
    this.svg.select("g.y")
      .call(this.y_axis);

    // Change the bars
    this.svg.selectAll("rect")
    .data(this._data)
    .transition()
    .duration(800)
    .attr("y", (d) => {
      return this.y(d['value']['values'])
    })
    .attr("transform", `translate(0, -${this.margin.top})`)
    .attr("height", (d) => {
      return this.height - this.y(d['value']['values'])
    })
  }
}
