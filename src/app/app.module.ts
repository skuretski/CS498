import { MainService } from './main.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InauguralComponent } from './views/inaugural/inaugural.component';
import { SecondSeasonComponent } from './views/second-season/second-season.component';
import { ThirdSeasonComponent } from './views/third-season/third-season.component';
import { StageOneComponent } from './views/inaugural/stages/stage-one/stage-one.component';
import { StageTwoComponent } from './views/inaugural/stages/stage-two/stage-two.component';
import { MapStatsComponent } from './graphs/map-stats/map-stats.component';
import { AllSeasonsComponent } from './views/all-seasons/all-seasons.component';

@NgModule({
  declarations: [
    AppComponent,
    InauguralComponent,
    SecondSeasonComponent,
    ThirdSeasonComponent,
    StageOneComponent,
    StageTwoComponent,
    MapStatsComponent,
    AllSeasonsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [ MainService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
