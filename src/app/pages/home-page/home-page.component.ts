import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/shared/shared/data.service';
import { environment } from 'src/environments';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  brand = environment.branding;
  versionInfo = environment.version;
  myStyle: SafeHtml;
  constructor(
    private router: Router,
    public translate: TranslateService,
    private dataService: DataService,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.myStyle = this._sanitizer.bypassSecurityTrustHtml(
      `<style>
      .header__right::before {color: ${this.branding.generalConfig.homeAngle} !important};
      </style>`
    );
    setTimeout(() => {
      if (this.appData) {
        this.router.navigate(['/intro']);
      }
    }, 2800);
  }

  get appData() {
    return this.dataService.appData;
  }
  get branding() {
    return this.dataService.branding;
  }
}
