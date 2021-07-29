import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-choose-screenshot',
  templateUrl: './choose-screenshot.component.html',
  styleUrls: ['./choose-screenshot.component.scss'],
})
export class ChooseScreenshotComponent implements OnInit {
  items: any[] = [];

  responsiveOptions;

  constructor(
    public TranslateService: TranslateService,
    private router: Router
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
    this.items = [
      {
        picture: '../../../assets/images/01.png',
      },
      {
        picture: '../../../assets/images/01.png',
      },
    ];
  }

  backToScreenShot() {
    this.router.navigate(['/recording']);
  }

  redirectTo() {
    this.router.navigate(['/self-assesment']);
  }
}
