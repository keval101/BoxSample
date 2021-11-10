import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { HeaderService } from './features/header/header.service';
import { DataService } from './shared/shared/data.service';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  videoFullScreen = false;
  recordingScreen = false;
  appData;
  constructor(
    private primengConfig: PrimeNGConfig,
    public translate: TranslateService,
    private dataservice: DataService,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    translate.setDefaultLang('en');
    translate.use('en');

    this.headerService.videoFullscreen.subscribe((res) => {
      if (this.location.path() === '/recording') {
        this.recordingScreen = true;
      } else {
        this.recordingScreen = false;
      }
      if (res === true) {
        this.videoFullScreen = true;
      } else {
        this.videoFullScreen = false;
      }
    });

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && !this.appData) {
        const anyCase = this.route.snapshot.queryParams['sceneId'];
        if (dataservice.getSessionData('caseData')) {
          const d = JSON.parse(dataservice.getSessionData('caseData'));
          if (
            (d.sceneId && d.sceneId === anyCase) ||
            (!d.sceneId && (anyCase === 'caseOne' || !anyCase))
          ) {
            this.appData = d.case;
            this.dataservice.appData = d.case;
          } else {
            this.getAppData(anyCase ? anyCase : null);
          }
        } else {
          this.getAppData(anyCase ? anyCase : null);
        }
      }
    });
  }

  ngOnInit(): void {
    this.dataservice.setSessionData('/', 'currentUrl');
    this.primengConfig.ripple = true;
  }

  getAppData(params) {
    this.dataservice.getData(params).subscribe((res) => {
      if (res) {
        this.appData = res;
        this.dataservice.appData = res;
        sessionStorage.clear();
        if (!window.indexedDB) {
          window.alert(
            "Your browser doesn't support a stable version of IndexedDB."
          );
        } else {
          indexedDB.deleteDatabase('myDatabase');
        }
        this.dataservice.setCaseData(res, 'case');
        if (params) {
          this.dataservice.setCaseData(params, 'sceneId');
        }
      }
    });
  }
}
