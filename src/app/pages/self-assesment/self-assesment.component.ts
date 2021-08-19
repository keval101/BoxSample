import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TakescreenshotService } from '../takescreenshot/takescreenshot.service';

@Component({
  selector: 'app-self-assesment',
  templateUrl: './self-assesment.component.html',
  styleUrls: ['./self-assesment.component.scss'],
})
export class SelfAssesmentComponent implements OnInit {
  recording: boolean;
  isScreenShot: boolean;
  items: any[] = [];
  responsiveOptions:any;

  constructor(
    private router: Router,
    public TranslateService: TranslateService,
    private takescreenshotService : TakescreenshotService
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '768px',
        numVisible: 2,
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
    this.isScreenShot = true;
    this.recording = true;
    this.items = this.takescreenshotService.captures
    console.log(this.takescreenshotService.captures)
  }

  redirectTo() {
    this.router.navigate(['/self-assesment-questions']);
  }
}
