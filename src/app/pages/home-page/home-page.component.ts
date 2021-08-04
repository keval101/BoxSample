import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  constructor(private router: Router, public translate: TranslateService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/recording']);
    }, 2000);
  }

  redirectTo() {
    this.router.navigate(['/recording']);
  }
}
