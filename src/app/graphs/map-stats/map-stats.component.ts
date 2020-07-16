import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-map-stats',
  templateUrl: './map-stats.component.html',
  styleUrls: ['./map-stats.component.scss']
})
export class MapStatsComponent implements OnInit {
  @ViewChild('my_viz', { static: false} ) my_viz;

  @Input() data: any;
  @Input() title: string;

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
    .attr("viewBox", `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top  + this.margin.bottom + 100}`)
    this.buildBarChart();
  }

  ngOnInit() { }

  buildBarChart():void {
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

    let x = d3.scaleBand()
      .range([0,this.width])
      .domain(this.data.map((d) => { return d.map_name}))
      .padding(0.2);

    let y = d3.scaleLinear()
      .domain([0,600])
      .range([this.height, 0])

    let y_axis = d3.axisLeft(y)
      .tickFormat(d3.format("~s"))
    
    //let colors = d3.scaleLinear().domain([0, 600]).range(['red', 'blue']);
    let color_scale = d3.scaleOrdinal(d3.schemeTableau10);

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
      .style("fill-opacity", "0.8")
      .on("mouseover", (d) => {
        d3.select("#tooltip")
          .style("opacity", 0.9)
          .append("p")
          .style("margin-bottom", 0)
          .attr("id", "tooltip-text")
          .text(`Map name: ${d.map_name}`)
          .append("p")
          .style("margin-bottom", 0)
          .attr("id", "tooltip-text")
          .text(`Count: ${d.match_count}`)
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
      .attr("x", (d) => {
        return x(d.map_name)
      })

      .attr("y", (d) => { return y(0)})
      .attr("width", x.bandwidth())
      .attr("height", (d) => {
        return 0
      })
      .attr("transform", `translate(0, -${this.margin.top})`)
      .attr("fill", (d,i) => {
        return color_scale(i)
      })

    this.svg.selectAll("rect")
      .transition()
      .duration(800)
      .attr("y", (d) => { return y(d.match_count)})
      .attr("height", (d) => {
        return this.height - y(d.match_count)
      })
      .delay((d,i) => { return(i*50) })

  }
}
