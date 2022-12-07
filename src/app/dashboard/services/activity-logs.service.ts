import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { Merchant } from 'src/app/shared/model/Merchant';
import { PaginationQuery } from 'src/app/shared/model/PaginationQuery';
import { AmountCollected, IDashboard, IDashboardFilter } from '../models/dashboard';

const APIURL = '/api';

@Injectable()
export class ActivityLogsServices {
  constructor(private http: HttpClient) { }

  getActionLogs(pageQuery: any) {
    let url = `${APIURL}/action-logs?`;
    Object.keys(pageQuery).forEach((key) => {
      if (pageQuery[key] !== undefined) {
        const parseList = ['userEmails', 'logSections', 'logActions'];
        if (parseList.includes(key)) {
          url += `${key}=${JSON.stringify(pageQuery[key])}&`;
        } else {
          url += `${key}=${pageQuery[key]}&`;
        }
      }
    });

    const users = this.http.get<any>(url);
    return users;
  }
}
