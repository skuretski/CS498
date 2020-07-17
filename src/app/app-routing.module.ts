import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
