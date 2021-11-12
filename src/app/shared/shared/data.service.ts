import { Injectable } from '@angular/core';
import { environment } from 'src/environments';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  baseUrl = environment.API_HOST;
  appData;
  currentUrl: string;
  activeParams: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private location: Location
  ) {
    this.activeRouter.queryParams.subscribe((params) => {
      this.activeParams = params.sceneId;
    });
  }

  getScene(sceneId: string): Observable<any> {
    return this.http.get(this.baseUrl + `Scene/${sceneId}/details`);
  }

  getData(params): Observable<any> {
    params = params ? params : '6d1496f8-aa4c-4565-8eba-07727e8dc097';
    return this.http.get(`https://appdevelop.virtamed.cloud/api/scene/${params}/details`);
  }

  submitData(contextId: string, data): Observable<any> {
    return this.http.post(this.baseUrl + `user/reports/${contextId}`, data);
  }

  preserveQueryParams(url: string) {
    if (this.activeParams) {
      this.router.navigate([url], {
        queryParams: { sceneId: this.activeParams },
      });
      this.setSessionData(`${url}?sceneId=caseTwo`, 'currentUrl');
    } else {
      this.router.navigate([url]);
      this.setSessionData(url, 'currentUrl');
    }
  }

  setCaseData(obj, key) {
    if (this.getSessionData('caseData')) {
      const data = JSON.parse(this.getSessionData('caseData'));
      data[key] = obj;
      this.setSessionData(data, 'caseData');
    } else {
      this.setSessionData({ case: obj }, 'caseData');
    }
  }

  setSessionData(data: any, dataname) {
    if (typeof data === 'string') {
      sessionStorage.setItem(dataname, data);
    } else {
      sessionStorage.setItem(dataname, JSON.stringify(data));
    }
  }

  getSessionData(dataname) {
    return sessionStorage.getItem(dataname);
  }
}
