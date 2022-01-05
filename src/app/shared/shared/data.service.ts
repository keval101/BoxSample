import { Injectable } from '@angular/core';
import { environment } from 'src/environments';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  baseUrl = environment.API_HOST;
  appData;
  currentUrl: string;
  activeParams: string;
  activeReportGuid: string;
  screenShotsBlob = [];
  videoBlob = [];
  videoData;
  recordingStartTime;
  recordingEndTime;
  displayTimer;
  selfAssessmentScreenShot;
  intervalId: any;

  branding: any;

  loader = new BehaviorSubject(false);
  homeScreen = new BehaviorSubject(false);
  constructor(
    private http: HttpClient,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private location: Location,
    private messageService: MessageService
  ) {
    this.activeRouter.queryParams.subscribe((params) => {
      this.activeParams = params.sceneId;
      this.activeReportGuid = params.reportContextHash;
    });
  }

  setLoader(val) {
    this.loader.next(val);
  }

  getLoader() {
    return this.loader.asObservable();
  }

  getData(params): Observable<any> {
    params = params ? params : '6d1496f8-aa4c-4565-8eba-07727e8dc097';
    return this.http.get(this.baseUrl + `scene/${params}/details`);
  }

  getBrandingData(url): Observable<any> {
    return this.http.get(url);
  }

  showSuccess(message) {
    this.messageService.add({
      severity: 'success',
      summary: 'success',
      detail: message,
    });
  }

  showError(message) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  submitData(reportGuid: string, data): Observable<any> {
    const randomNum = CryptoJS.lib.WordArray.random(16);
    const IV = randomNum.toString(CryptoJS.enc.Base64);
    const keyString = 'fxhToKHXW82SlxvdfrYsIXMak2RdmpLD';
    const Key = CryptoJS.enc.Utf8.parse(keyString);
    const val = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    const encrypted = CryptoJS.AES.encrypt(val, Key, {
      iv: randomNum,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
    const b64 = encrypted.toString(CryptoJS.enc.Hex);

    return this.http.post(
      this.baseUrl + `user/reports/context/${reportGuid}`,
      b64,
      {
        headers: {
          'Content-Type': 'application/json',
          apiKey: 'kpgwtlAF2WTawB3ZlcUUsmCIYZTL4E',
          IV,
        },
      }
    );
  }

  uploadMedia(blobData, mimeType, url): Observable<any> {
    mimeType = mimeType ? mimeType : 'image/png';
    return this.http.put(url, blobData, {
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': mimeType,
      },
    });
  }

  preserveQueryParams(url: string) {
    if (this.activeParams || this.activeReportGuid) {
      this.router.navigate([url], {
        queryParams: {
          sceneId: this.activeParams,
          reportContextHash: this.activeReportGuid,
        },
      });
      if (this.activeParams) {
        this.setSessionData(
          `${url}?sceneId=${this.activeParams}`,
          'currentUrl'
        );
      }
      if (this.activeParams && this.activeReportGuid) {
        this.setSessionData(
          `${url}?sceneId=${this.activeParams}&reportContextHash=${this.activeReportGuid}`,
          'currentUrl'
        );
      }
      if (!this.activeParams && this.activeReportGuid) {
        this.setSessionData(
          `${url}?reportContextHash=${this.activeReportGuid}`,
          'currentUrl'
        );
      }
    } else {
      this.router.navigate([url]);
      this.setSessionData(url, 'currentUrl');
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
