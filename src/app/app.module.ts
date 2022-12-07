import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { EntityDataModule } from '@ngrx/data';
import { MDBBootstrapModulesPro, ToastModule, IconsModule } from 'ng-uikit-pro-standard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { FilterService, MessageService, PrimeNGConfig } from 'primeng/api';
import { NgxFileDropModule } from 'ngx-file-drop';
import { IntercomModule } from 'ng-intercom';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ToastModule as ToastModulePrimeng } from 'primeng/toast';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ErrorPageComponent } from './error-page/error-page.component';
import { SharedModule, HttpLoaderFactory } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { environment } from '../environments/environment';
import { metaReducers, reducers } from './reducers';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { INTERCOM_APP_ID } from './shared/intercom.constants';
import { UnauthorisedAccessComponent } from './unauthorised-access/unauthorised-access.component';
import { loadLanguageStyles } from './utils/loadLanguageStyles';
import { dataDogInitialize } from './utils/datadogRumInitialization';
import { PlanSubscriptionService } from './users-settings/services/plan-subscription.service';
import { VariantService } from './inventory/variants/services/variant.service';

@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent,
    UnauthorisedAccessComponent,
  ],
  imports: [
    NgMultiSelectDropDownModule,
    MatNativeDateModule,
    MatDialogModule,
    CoreModule,
    HttpClientModule,
    BrowserModule,
    MatDatepickerModule,
    MDBBootstrapModulesPro.forRoot(),
    ToastModule.forRoot(),
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthModule.forRoot(),
    StoreModule.forRoot(
      reducers, {
        metaReducers,
      },
    ),
    IntercomModule.forRoot({
      appId: INTERCOM_APP_ID,
      updateOnRouterChange: true,
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
      routerState: RouterState.Minimal,
    }),
    EntityDataModule.forRoot({}),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      isolate: true,
    }),
    SharedModule,
    NgxFileDropModule,
    TableModule,
    MultiSelectModule,
    IconsModule,
    ToastModulePrimeng,
    IconsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    Title,
    FilterService,
    PlanSubscriptionService,
    PrimeNGConfig,
    VariantService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: loadLanguageStyles,
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: dataDogInitialize,
    },
    MessageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
