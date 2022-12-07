import { CommonModule, DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { AppEffects } from '../applications/app.effects';
import { appsReducer } from '../applications/reducers/app.reducers';
import { BrowseAppsService } from '../applications/services/browse.apps.service';
import { SharedModule } from '../shared/shared.module';
import { locationsFeatureKey, locationsReducer } from '../users-settings/reducers/locations.reducer';
import { SettingsService } from '../users-settings/services/settings.service';
import { SettingsEffects } from '../users-settings/settings.effects';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardAmountCollectedComponent } from './overview/amount-collected/amount-collected.component';
import { DashboardOrdersComponent } from './overview/orders/orders.component';
import { OverviewComponentV2 } from './overview';
import { DashboardGrossProfitComponent } from './overview/profit/gross-profit.component';
import { DashboardRevenueComponent } from './overview/revenue/revenue.component';
import { DashboardTransactionComponent } from './overview/transaction/transaction.component';
import { DashboardServices } from './services/dashboard.services';
import { LocationsResolver } from '../users-settings/services/locations.resolver';
import { AppsResolver } from '../applications/services/app.resolver';
import { DashboardSalesComponent } from './overview/sales/sales.component';
import { InventoryValueComponent } from './overview/inventory-value/inventory-value.component';
import { AverageSalesComponent } from './overview/average-sales/average-sales.component';
import { AverageItemsSaleComponent } from './overview/average-items-sale/average-items-sale.component';
import { DashboardCardComponent } from './overview/overview-v2/dashboard-card/dashboard-card.component';
import { HasNoTransactionsPipe } from './overview/overview-v2/dashboard-card/pipes/has-no-transactions.pipe';
import { TopProductsComponent } from './overview/overview-v2/top-products/top-products.component';
import { AmountCollectedComponent } from './overview/overview-v2/amount-collected/amount-collected.component';

import { ActionLogsComponent } from './action-logs/action-logs.component';

import { UsersResolver } from '../users-settings/services/users.resolver';
import { usersFeatureKey, usersReducer } from '../users-settings/reducers/users.reducer';
import { ActivityLogsServices } from './services/activity-logs.service';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    NgbModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    CheckboxModule,
    ButtonModule,
    DropdownModule,
    MultiSelectModule,
    EffectsModule.forFeature([SettingsEffects, AppEffects]),
    StoreModule.forFeature(locationsFeatureKey, locationsReducer),
    StoreModule.forFeature(usersFeatureKey, usersReducer),
    StoreModule.forFeature('applications-subscriptions', appsReducer),
  ],
  declarations: [
    OverviewComponentV2,
    DashboardRevenueComponent,
    DashboardAmountCollectedComponent,
    DashboardGrossProfitComponent,
    DashboardTransactionComponent,
    DashboardOrdersComponent,
    DashboardSalesComponent,
    InventoryValueComponent,
    AverageSalesComponent,
    AverageItemsSaleComponent,
    DashboardCardComponent,
    HasNoTransactionsPipe,
    TopProductsComponent,
    AmountCollectedComponent,
    ActionLogsComponent,
  ],
  providers: [
    DatePipe,
    SettingsService,
    BrowseAppsService,
    DashboardServices,
    ActivityLogsServices,
    AppsResolver,
    LocationsResolver,
    UsersResolver,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule { }
