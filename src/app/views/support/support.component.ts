import { MainService } from './../../main.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  title: string = 'Support Breakdown';

  constructor(public ms: MainService) { }

  ngOnInit() {}

}
