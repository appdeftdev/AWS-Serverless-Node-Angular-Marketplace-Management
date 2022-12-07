import {
  AfterViewInit, Component, NgZone, OnInit,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { datadogRum } from '@datadog/browser-rum';
import {
  NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router,
} from '@angular/router';
import { distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { Intercom } from 'ng-intercom';
import { PrimeNGConfig } from 'primeng/api';
import { Overlay, BlockScrollStrategy } from '@angular/cdk/overlay';
import { MAT_SELECT_SCROLL_STRATEGY } from '@angular/material/select';
import { AppState } from './reducers';
import * as authActions from './auth/auth.actions';
import { SpinnerService } from './shared/services/spinner.service';
import { selectUser } from './auth/auth.selectors';
import { environment } from '../environments/environment';
import { INTERCOM_APP_ID } from './shared/intercom.constants';
import { AutoUnsubscribe } from './shared/decorators/auto-unsubscribe';

declare let pendo: any;
export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    { provide: MAT_SELECT_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] },
  ],
})
@AutoUnsubscribe
export class AppComponent implements OnInit, AfterViewInit {
  subscriptionRefs;

  lng: 'ar' | 'en';

  constructor(
    private store: Store<AppState>,
    public spinnerService: SpinnerService,
    private router: Router,
    private titleService: Title,
    public intercom: Intercom,
    private ngZone: NgZone,
    private primengConfig: PrimeNGConfig,
  ) {
    if (environment.applicationUrl === 'https://platform.rewaatech.com') {
      const temp = document.createElement('meta');
      temp.innerHTML = `<meta property="og:title" content="رواء | نظام متقدم يساعد المحلات التجارية على إدارة المخزون والمبيعات - رِواء">
    <meta property="og:description" content="مع منصة رواء بإمكان التاجر إدارة المخزون، المبيعات، الفواتير والمشتريات من شاشة واحدة">
    <meta property="og:url" content="https://www.rewaatech.com/">
    <meta property="og:image" content="https://www.rewaatech.com/wp-content/uploads/2021/09/Arabic-MIMS-Photo.svg">
    <meta property="og:locale" content="ar_AR">
    <meta name="description" content="مع منصة رواء بإمكان التاجر إدارة المخزون، المبيعات، الفواتير والمشتريات من شاشة واحدة">`;
      const { head } = document;
      while (temp.firstChild) {
        head.appendChild(temp.firstChild);
      }
    } else {
      const temp = document.createElement('meta');
      temp.innerHTML = '<meta name="robots" content="noindex"> <meta name="googlebot" content="noindex">';
      const { head } = document;
      while (temp.firstChild) {
        head.appendChild(temp.firstChild);
      }
    }

    if (!(localStorage.getItem('language'))) {
      localStorage.setItem('language', 'ar');
    }
    if (localStorage.getItem('language') === 'ar') {
      this.lng = 'ar';
      this.titleService.setTitle('منصة رواء');
    } else {
      this.lng = 'en';
      this.titleService.setTitle('Rewaa Platform');
    }
    this.store.dispatch(authActions.setUserState());
    this.subscriptionRefs = this.router.events
      .pipe(
        filter(
          (event) => event instanceof NavigationStart
            || event instanceof NavigationEnd
            || event instanceof NavigationCancel
            || event instanceof NavigationError,
        ),
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.spinnerService.startLoading();
          return;
        }
        this.spinnerService.stopLoading();
      });
    this.handleDatadog();
    this.handlePendo();
  }

  ngAfterViewInit = (): void => {
    if (localStorage.getItem('language') === 'ar') window.document.body.classList.add('rtl');
    else window.document.body.classList.add('ltr');
  };

  ngOnInit() {
    if (window.location !== window.parent.location) {
      window.parent.location.href = window.location.href;
    }
    this.handleIntercom();
    this.handleUserguiding();
    this.initiateRippleEffect();
  }

  handlePendo() {
    if (environment.enablePendo) {
      this.store
        .pipe(
          select(selectUser),
          filter((user) => !!user),
          distinctUntilChanged(),
          tap((user) => {
            this.ngZone.runOutsideAngular(() => {
              pendo.initialize({
                visitor: {
                  id: `${user.id}`,
                  email: user.email,
                  role: (user as any).SystemRole,
                },
                account: {
                  id: user.schemaName,
                  isPaying: user.RewaaAccountSubscription
                  && !user.RewaaAccountSubscription.trialPlan,
                },
              });
            });
          }),
        )
        .subscribe();
    }
  }

  handleDatadog() {
    if (environment.enableDatadog) {
      datadogRum.init({
        applicationId: 'dfe377a8-c7fa-4cc9-98e4-bbe2e0a4fc45',
        clientToken: 'pub5d89d6f309db076e9f02dd6a2391b043',
        site: 'datadoghq.com',
        service: 'Rewaa Platform',
        //  env: 'production',
        //  version: '1.0.0',
        sampleRate: 100,
        trackInteractions: true,
      });
      this.store
        .pipe(
          select(selectUser),
          filter((user) => !!user),
          distinctUntilChanged(),
          tap((user) => {
            datadogRum.setUser({
              id: `${user.id}`,
              email: user.email,
              plan: user.RewaaAccountSubscription,
            });
          }),
        )
        .subscribe();
    }
  }

  handleIntercom() {
    this.store
      .pipe(
        select(selectUser),
        tap((user) => {
          if (environment.enableIntercom) {
            const alignment = this.lng === 'ar' ? 'right' : 'left';
            if (user) {
              this.intercom.boot({
                app_id: INTERCOM_APP_ID,
                email: user.email,
                user_id: `${user.id}`,
                created_at: new Date(user.createdAt).valueOf(),
                // custom fields need to be in quotes
                'company name': user.companyName,
                'phone number': user.phone,
                website: user.website,
                'business type': user.companyType,
                alignment,
              });
            }
          }
        }),
        distinctUntilChanged(),
        tap((user) => {
          if (user) {
            if (environment.enableIntercom) {
              this.intercom.update({
                app_id: INTERCOM_APP_ID,
                email: user.email,
                user_id: `${user.id}`,
                created_at: new Date(user.createdAt).valueOf(),
                // custom fields need to be in quotes
                'company name': user.companyName,
                'phone number': user.phone,
                website: user.website,
                'business type': user.companyType,
              });
            }
          }
        }),
      )
      .subscribe();
  }

  handleUserguiding() {
    if (environment.enableUserGuiding) {
      this.store
        .pipe(
          select(selectUser),
          filter((user) => !!user),
          distinctUntilChanged(),
          tap((user) => {
            // eslint-disable-next-line @typescript-eslint/dot-notation
            window['userGuiding'].identify(user.email, {
              email: user.email,
              name: user.companyName,
              created_at: new Date().getTime(),
            });
          }),
        )
        .subscribe();
    }
  }

  isMobile = () => window.innerWidth <= 992;

  initiateRippleEffect(): void {
    this.primengConfig.ripple = true;
  }
}
