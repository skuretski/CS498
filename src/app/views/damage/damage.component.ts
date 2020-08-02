import { MainService } from './../../main.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-damage',
  templateUrl: './damage.component.html',
  styleUrls: ['./damage.component.scss']
})
export class DamageComponent implements OnInit {
  title: string = 'Damage Breakdown';

  constructor(public ms: MainService) { }

  ngOnInit() {
  }
}
