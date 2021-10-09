import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/shared/shared/data.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  constructor(
    private router: Router,
    public translate: TranslateService,
    private dataService: DataService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/intro']);
    }, 2800);
  }

  get appData() {
    return this.dataService.appData;
  }
}
