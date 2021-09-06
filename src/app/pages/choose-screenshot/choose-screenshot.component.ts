import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TakescreenshotService } from '../takescreenshot/takescreenshot.service';
@Component({
  selector: 'app-choose-screenshot',
  templateUrl: './choose-screenshot.component.html',
  styleUrls: ['./choose-screenshot.component.scss'],
})
export class ChooseScreenshotComponent implements OnInit {
  items: any[] = [];
  recording: boolean = false;
  responsiveOptions:any;

  constructor(
    public TranslateService: TranslateService,
    private router: Router,
    private takescreenshotService : TakescreenshotService
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 1,
        numScroll: 3,
      },
      {
        breakpoint: '768px',
        numVisible: 1,
        numScroll: 2,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  ngOnInit(): void {
    this.recording = true;
    this.items = this.takescreenshotService.captures
  }

  backToScreenShot() {
    this.takescreenshotService.captures.pop();
    this.router.navigate(['/takescreenshot']);
  }

  redirectTo() {
    this.router.navigate(['/self-assesment']);
  }
}
