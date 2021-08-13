import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RecordingService } from './recording.service';
import { fadeAnimation } from '../../shared/app.animation';
import { ChoosescreenshotService } from '../choose-screenshot/choosescreenshot.service';
import { interval, Subscription } from 'rxjs';

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
  counterTime:boolean = false;
  paddingClass:boolean;
  data = [3,2,1,"go"]
  text;

  constructor(
    public TranslateService: TranslateService,
    private router: Router,
    private recordingService: RecordingService,
    private choosescreenshotService : ChoosescreenshotService
  ) {}

  ngOnInit(): void {
    const obs = interval(1000)
    const timer:Subscription = obs.subscribe( (d) => {
      this.counterTime = true;
      let text = this.data[d];
      this.text = text

      if(d == 3){
        this.paddingClass = true
      }
    })
    setTimeout(() => {
        timer.unsubscribe()
        this.counterTime = false
    }, 5000 );

    if(this.choosescreenshotService.backToScreen == true){
      timer.unsubscribe()
      this.takeScreenshot = true;
      this.recording = true;
      this.isScreenShot = true;
    }
  }

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
  }

  onSlidebarClose() {
    this.isSidebarOpen = false;
  }
}
