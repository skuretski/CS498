import { SupportComponent } from './views/support/support.component';
import { DamageComponent } from './views/damage/damage.component';
import { TanksComponent } from './views/tanks/tanks.component';
import { MapsComponent } from './views/maps/maps.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'records', component: MapsComponent },
  { path: 'tanks', component: TanksComponent },
  { path: 'damage', component: DamageComponent }, 
  { path: 'support', component: SupportComponent },
  { path: '**', component: MapsComponent }
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
