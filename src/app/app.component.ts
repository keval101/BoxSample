import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { HeaderService } from './features/header/header.service';
import { DataService } from './shared/shared/data.service';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, Event } from '@angular/router';
import { environment } from 'src/environments';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  videoFullScreen = false;
  recordingScreen = false;
  hasDataReceived = false;
  appData;
  loader;
  versionInfo: string;

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
    this.versionInfo = environment.version;
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
        if (!this.hasDataReceived) {
          this.hasDataReceived = true;
          this.getAppData(anyCase ? anyCase : null);
        }
      }
    });
  }

  ngOnInit(): void {
    this.dataservice.getLoader().subscribe((res) => {
      this.loader = res;
    });
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        history.pushState(null, null, window.location.href);
      }
    });
    sessionStorage.clear();
    this.dataservice.setSessionData('/', 'currentUrl');
    this.primengConfig.ripple = true;
  }

  getAppData(params) {
    this.dataservice.getData(params).subscribe(
      (res) => {
        if (res) {
          this.appData = res;
          this.dataservice.appData = res;
          sessionStorage.clear();
        }
      },
      (err) => {
        this.dataservice.showError(
          'Some issue occured. Please contact your administrator!'
        );
      }
    );
  }
}
