import { Injectable } from '@angular/core';
import { environment } from 'src/environments';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  baseUrl = environment.API_HOST;

  constructor(private http: HttpClient) {}

  getScene(sceneId: string): Observable<any> {
    return this.http.get(this.baseUrl + `Scene/${sceneId}/details`);
  }
  getData(): Observable<any> {
    return this.http.get('../../../assets/data/caseOne.json');
  }
  submitData(contextId: string, data): Observable<any> {
    return this.http.post(this.baseUrl + `user/reports/${contextId}`, data);
  }
}
