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

  takeScreenShot() {
    this.isScreenShot = true;
  }

  onRetry() {
    this.isScreenShot = false;
    this.recording = false;
  }

  onDone() {
    this.isScreenShot = false;
    this.recording = false;
  }

  onFinish() {
    this.isScreenShot = true;
    this.recording = true;

    this.router.navigate(['/choosescreenshot']);
  }
}
