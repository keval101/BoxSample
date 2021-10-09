import { Injectable } from '@angular/core';
import { environment } from 'src/environments';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  baseUrl = environment.API_HOST;
  appData;

  constructor(private http: HttpClient) {}

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
}
