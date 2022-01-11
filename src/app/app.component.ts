import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { HeaderService } from './features/header/header.service';
import { DataService } from './shared/shared/data.service';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, Event } from '@angular/router';
import { environment } from 'src/environments';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  videoFullScreen = false;
  recordingScreen = false;
  hasDataReceived = false;
  homeScreen = false;
  appData;
  branding;
  loader: boolean;
  appLoader: boolean;

  public versionInfo = environment.version;

  constructor(
    private primengConfig: PrimeNGConfig,
    public translate: TranslateService,
    public dataservice: DataService,
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

    if (this.location.path() === '') {
      this.dataservice.homeScreen.next(true);
    } else {
      this.dataservice.homeScreen.next(false);
    }

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && !this.appData) {
        const anyCase = this.route.snapshot.queryParams['sceneIdentifier'];
        const brandingParam = this.route.snapshot.queryParams['branding'];
        if (!this.hasDataReceived) {
          this.hasDataReceived = true;
          this.getAppData(
            anyCase ? anyCase : null,
            brandingParam ? brandingParam : null
          );
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

  getAppData(params, brandingParam) {
    this.dataservice.setLoader(true);
    environment.branding = brandingParam ? brandingParam : environment.branding;
    const url = `../assets/branding/${environment.branding}.json`;
    const response = forkJoin([
      this.dataservice.getBrandingData(url),
      this.dataservice.getData(params),
    ]);

    response.subscribe(
      (res) => {
        this.dataservice.branding = res[0];
        this.branding = res[0];
        this.appData = res[1];
        this.dataservice.appData = res[1];
        sessionStorage.clear();
        this.loader = false;
        this.appLoader = true;
        this.dataservice.setLoader(false);
      },
      (err) => {
        this.dataservice.setLoader(false);
        this.loader = false;
        this.dataservice.showError(
          'Some issue occured. Please contact your administrator!'
        );
      }
    );
  }
}
