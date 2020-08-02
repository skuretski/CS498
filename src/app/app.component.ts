import { MainService } from './main.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ MainService ]
})
export class AppComponent implements OnInit {
  active: string = '/';

  route_sub: Subscription;

  constructor(public ms: MainService, public router: Router) {
    this.route_sub = this.router.events.subscribe((val) => {
      if(val instanceof NavigationEnd) {
        this.active = this.router.url;
        if(this.active === '/damage') {
          this.ms.finished_slideshow = true;
        }
        console.log(this.active);
      }
    })
  }

  async ngOnInit() {
    await this.ms.init();
  }

  next(route: string) {
    if(route === '/records') {
      this.router.navigate(['/tanks'])
    } else if(route === '/tanks') {
      this.router.navigate(['support'])
    } else if(route === '/support') {
      this.ms.finished_slideshow = true
      this.router.navigate(['/damage']);
    } else if(route === '/') {
      this.router.navigate(['/tanks']);
    }
  }

  back(route: string) {
    if(route === '/damage') {
      this.router.navigate(['/support']);
    } else if(route === '/support') {
      this.router.navigate(['/tanks']);
    } else if(route === '/tanks') {
      this.router.navigate(['/records']);
    }
  }
}


