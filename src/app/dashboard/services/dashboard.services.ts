import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { AmountCollected, IDashboard, IDashboardFilter } from '../models/dashboard';

const APIURL = '/api';

@Injectable()
export class DashboardServices {
  constructor(private http: HttpClient) { }

  getDashboard(filters: IDashboardFilter): Observable<IDashboard> {
    const queryParams = new HttpParams()
      .set('startDate', (filters.startDate) ? filters.startDate.toUTCString() : '')
      .set('endDate', (filters.endDate) ? filters.endDate.toUTCString() : '')
      .set('location', filters.location)
      .set('channel', filters.channel);

    return this.http.get<IDashboard>(`${APIURL}/dashboard`, { observe: 'response', params: queryParams }).pipe(
      map((response: HttpResponse<IDashboard>) => {
        if (response.status === 200 && response.body != null) {
          return response.body;
        }
        return null;
      }),
    );
  }

  getMetabaseDashboardUrl(reportId, isArabicVersion): Observable<string> {
    return this.http.get<string>(`${APIURL}/metabase-dashboard-url/${reportId}`, { params: { isArabicVersion } });
  }

  getPaymentMethodReport(filters: IDashboardFilter): Observable<AmountCollected> {
    const queryParams = new HttpParams()
      .set('startDate', (filters.startDate) ? filters.startDate.toUTCString() : '')
      .set('endDate', (filters.endDate) ? filters.endDate.toUTCString() : '')
      .set('location', filters.location);

    return this.http.get<AmountCollected>(`${APIURL}/paymentMethods-report`, { observe: 'response', params: queryParams }).pipe(
      map((response: HttpResponse<AmountCollected>) => {
        if (response.status === 200 && response.body != null) {
          return response.body;
        }
        return null;
      }),
    );
  }

  getInventoryValue(requestObj): Observable<any> {
    const queryParams = new HttpParams()
      .set('location', requestObj.location ? requestObj.location : 'undefined');
    return this.http.get(`${APIURL}/inventory-value`, { params: queryParams });
  }

  getReports(): Observable<any> {
    return this.http.get<any>(`${APIURL}/reports`);
  }

  getUserReports(): Observable<any> {
    return this.http.get<any>(`${APIURL}/user-reports`);
  }

  pinReport(reportId: number, pinned: boolean): Observable<any> {
    return this.http.put<any>(`${APIURL}/reports/pin/${reportId}/${pinned}`, {});
  }
}
