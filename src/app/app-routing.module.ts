import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InauguralComponent } from '../app/views/inaugural/inaugural.component';
import { SecondSeasonComponent } from './views/second-season/second-season.component';

const routes: Routes = [

];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
    {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
      scrollOffset: [0,196]
    }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
