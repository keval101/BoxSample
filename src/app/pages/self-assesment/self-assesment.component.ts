import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-self-assesment',
  templateUrl: './self-assesment.component.html',
  styleUrls: ['./self-assesment.component.scss'],
})
export class SelfAssesmentComponent implements OnInit {
  recording: boolean;
  isScreenShot: boolean;
  items: any[] = [];
  responsiveOptions;

  constructor(
    private router: Router,
    public TranslateService: TranslateService
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

    this.items = [
      {
        picture: '../../../assets/images/result.png',
      },
      {
        picture: '../../../assets/images/01.png',
      },
    ];
  }

  redirectTo() {
    this.router.navigate(['/self-assesment-questions']);
  }
}
