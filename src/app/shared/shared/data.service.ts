import { Injectable } from '@angular/core';
import { environment } from 'src/environments';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as CryptoJS from 'crypto-js';

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

  getData(params): Observable<any> {
    params = params ? params : '6d1496f8-aa4c-4565-8eba-07727e8dc097';
    return this.http.get(this.baseUrl + `scene/${params}/details`);
  }

  submitData(reportGuid: string, data): Observable<any> {
    const randomNum = CryptoJS.lib.WordArray.random(16);
    const IV = randomNum.toString(CryptoJS.enc.Base64);

    return this.http.post(
      this.baseUrl + `user/reports/context/${reportGuid}`,
      data,
      {
        headers: {
          'content-type': 'application/json',
          apiKey: 'kpgwtlAF2WTawB3ZlcUUsmCIYZTL4E',
          IV,
        },
      }
    );
  }

  uploadMedia(blobData, mimeType): Observable<any> {
    const fd = new FormData();
    fd.append('fname', 'screenShot.png');
    fd.append('data', blobData);

    return this.http.put(
      'https://virtamed.blob.core.windows.net/connect-develop-images/28c4f86f-b007-4c9f-89a1-4727b38e9c1a.png?sv=2017-04-17&sr=b&sig=uSIYvo3RsPJIgUokqnpfeQwaqqvJlB%2Fyl4rhphtVbm4%3D&se=2021-11-30T09%3A19%3A56Z&sp=rcw&rscc=public%2C%20max-age%3D1209600',
      fd,
      {
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': mimeType,
        },
      }
    );
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
