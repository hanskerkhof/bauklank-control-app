import { Routes } from '@angular/router';
import { DmxControlComponent } from './features/dmx-control/dmx-control.component';
import { FixtureDetailComponent } from './features/fixture-detail/fixture-detail.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: DmxControlComponent,
  },
  {
    path: 'fixtures',
    component: FixtureDetailComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
