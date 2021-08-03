import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-recording-screen',
  templateUrl: './recording-screen.component.html',
  styleUrls: ['./recording-screen.component.scss'],
})
export class RecordingScreenComponent implements OnInit {
  constructor(
    public TranslateService: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  recording: boolean = false;
  isScreenShot: boolean = false;
  takeScreenshot: boolean = false;
  isSidebarOpen: boolean = false;

  onRetake() {
    this.takeScreenshot = false;
  }

  onDone() {
   
  }

  onFinish() {
    this.router.navigate(['/self-assesment']);
  }

  takeScreenShot() {
    this.takeScreenshot = true;
  }

  onSlidebarOpen(value) {
    this.isSidebarOpen = true;
    console.log(value);
  }

  onSlidebarClose() {
    this.isSidebarOpen = false;
  }
}
