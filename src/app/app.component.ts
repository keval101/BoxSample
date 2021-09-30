import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { HeaderService } from './features/header/header.service';
import { DataService } from './shared/shared/data.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  videoFullScreen = false;
  recordingScreen = false;

  constructor(
    private primengConfig: PrimeNGConfig,
    public translate: TranslateService,
    private dataservice: DataService,
    private headerService: HeaderService,
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
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.dataservice.getScene('12345jj').subscribe(() => {});
  }
}
