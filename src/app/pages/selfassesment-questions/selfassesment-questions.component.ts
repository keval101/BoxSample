import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { fadeAnimation } from 'src/app/shared/app.animation';

@Component({
  selector: 'app-selfassesment-questions',
  templateUrl: './selfassesment-questions.component.html',
  styleUrls: ['./selfassesment-questions.component.scss'],
  animations: [fadeAnimation],
})
export class SelfassesmentQuestionsComponent implements OnInit {
  recording: boolean;
  isScreenShot: boolean;
  answer1: any = 'Yes';
  answer2: any;
  answer3: any;
  sidebarOpen: boolean;
  constructor(
    private router: Router,
    public TranslateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.isScreenShot = true;
    this.recording = true;
  }

  slibar() {
    this.sidebarOpen = true;
  }
  closeSidebar() {
    this.sidebarOpen = false;
  }

  redirectTo() {
    this.router.navigate(['/evaluation']);
  }
}
