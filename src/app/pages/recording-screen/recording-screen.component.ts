import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RecordingService } from './recording.service';
import { fadeAnimation } from '../../shared/app.animation';
import { interval, Subscription } from 'rxjs';
import { ChoosescreenshotService } from '../choose-screenshot/choosescreenshot.service';

@Component({
  selector: 'app-recording-screen',
  templateUrl: './recording-screen.component.html',
  styleUrls: ['./recording-screen.component.scss'],
  animations: [fadeAnimation],
})
export class RecordingScreenComponent implements OnInit {
  recording: boolean = false;
  isScreenShot: boolean = false;
  takeScreenshot: boolean = false;
  isSidebarOpen: boolean = false;

  constructor(
    public TranslateService: TranslateService,
    private router: Router,
    private recordingService: RecordingService
  ) {}

  ngOnInit(): void {}

  onRetake() {
    this.takeScreenshot = false;
  }

  onDone() {
    this.router.navigate(['/choosescreenshot']);
  }

  onFinish() {
    this.recordingService.fullscreen = false;
    this.recording = true;
    this.isScreenShot = true;
    this.isSidebarOpen = false;
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
