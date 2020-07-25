import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hero-stats',
  templateUrl: './hero-stats.component.html',
  styleUrls: ['./hero-stats.component.scss']
})
export class HeroStatsComponent implements OnInit {
  @Input() title:string;
  constructor() { }

  ngOnInit(): void {
  }

}
