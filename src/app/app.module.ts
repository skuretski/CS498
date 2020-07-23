import { MainService } from './main.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MapStatsComponent } from './graphs/map-stats/map-stats.component';
import { MapsComponent } from './views/maps/maps.component';
import { TanksComponent } from './views/tanks/tanks.component';
import { SupportComponent } from './views/support/support.component';
import { DamageComponent } from './views/damage/damage.component';

@NgModule({
  declarations: [
    AppComponent,
    MapStatsComponent,
    MapsComponent,
    TanksComponent,
    SupportComponent,
    DamageComponent
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
