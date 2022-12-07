import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DndModule } from 'ngx-drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatTimepickerModule } from 'mat-timepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { ExpensesEffects } from './expenses.effects';
import { AppEffects } from '../applications/app.effects';
import { LocationsResolver } from '../users-settings/services/locations.resolver';
import { appsReducer } from '../applications/reducers/app.reducers';
import { SubscribedAppsResolver } from '../applications/services/subscribed-apps.resolver';
import { CreateExpenseComponent } from './components/create-expense/create-expense.component';
import { SharedModule } from '../shared/shared.module';
import { AppsResolver } from '../applications/services/app.resolver';
import { ExpensesListComponent } from './components/expenses-list/expenses-list.component';
import { ExpensesRoutingModule } from './expenses-routing.module';
import { BrowseAppsService } from '../applications/services/browse.apps.service';
import { NotificationHandler } from '../inventory/variants/util/notification.handler';
import { SettingsService } from '../users-settings/services/settings.service';
import { expensesFeatureKey, expensesReducer } from './reducers/expense.reducer';
import { ExpenseCategoriesResolver } from './services/expense-categories.resolver';
import { expenseCategoriesReducer } from './reducers/expense-categories.reducers';
import { ExpenseCategoryEffects } from './expense-category.effects';
import { ExpenseCategoryComponent } from './components/expense-category/expense-category.component';

@NgModule({
  declarations: [
    ExpensesListComponent,
    CreateExpenseComponent,
    ExpenseCategoryComponent,
  ],
  imports: [
    CommonModule,
    ExpensesRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DndModule,
    MatSelectModule,
    MatExpansionModule,
    MatInputModule,
    MatRadioModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatDialogModule,
    MatChipsModule,
    ScrollingModule,
    MatCardModule,
    RouterModule,
    MatTooltipModule,
    MatMenuModule,
    NgxFileDropModule,
    MatProgressBarModule,
    MDBBootstrapModulesPro,
    EffectsModule.forFeature([
      AppEffects,
      ExpensesEffects,
      ExpenseCategoryEffects,
    ]),
    StoreModule.forFeature('applications-subscriptions', appsReducer),
    StoreModule.forFeature('expenseCategories', expenseCategoriesReducer),
    StoreModule.forFeature(expensesFeatureKey, expensesReducer),
  ],
  entryComponents: [
    ExpenseCategoryComponent,
  ],
  providers: [
    AppsResolver,
    ExpenseCategoriesResolver,
    SubscribedAppsResolver,
    LocationsResolver,
    BrowseAppsService,
    NotificationHandler,
    SettingsService,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
})
export class ExpensesModule { }
