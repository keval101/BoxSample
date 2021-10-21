import { Injectable } from '@angular/core';
import { environment } from 'src/environments';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  baseUrl = environment.API_HOST;
  appData;
  activeParams: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private activeRouter: ActivatedRoute
  ) {
    this.activeRouter.queryParams.subscribe((params) => {
      this.activeParams = params.sceneId;
    });
  }

  getScene(sceneId: string): Observable<any> {
    return this.http.get(this.baseUrl + `Scene/${sceneId}/details`);
  }

  getData(params): Observable<any> {
    params = params ? params : 'caseOne';
    return this.http.get(`../../../assets/data/${params}.json`);
  }

  submitData(contextId: string, data): Observable<any> {
    return this.http.post(this.baseUrl + `user/reports/${contextId}`, data);
  }

  preserveQueryParams(url: string) {
    return this.router.navigate([url], {
      queryParams: { sceneId: this.activeParams },
    });
  }
}
