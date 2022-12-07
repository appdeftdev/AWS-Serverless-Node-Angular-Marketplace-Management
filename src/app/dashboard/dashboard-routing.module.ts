import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponentV2 } from './overview';
import { LocationsResolver } from '../users-settings/services/locations.resolver';
import { AppsResolver } from '../applications/services/app.resolver';
import { ActionLogsComponent } from './action-logs/action-logs.component';
import { UsersResolver } from '../users-settings/services/users.resolver';

const dashboardRoutes: Routes = [
  {
    path: '',
    component: OverviewComponentV2,
    resolve: {
      'location-resolver': LocationsResolver,
      'application-resolver': AppsResolver,
    },
  },
  {
    path: 'action-logs',
    component: ActionLogsComponent,
    resolve: {
      users: UsersResolver,
      'location-resolver': LocationsResolver,
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
