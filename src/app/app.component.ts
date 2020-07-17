import { MainService } from './main.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ MainService ]
})
export class AppComponent implements OnInit {
  active = 'maps';

  constructor(public ms: MainService) {}

  async ngOnInit() {
    await this.ms.init();
  }
}


