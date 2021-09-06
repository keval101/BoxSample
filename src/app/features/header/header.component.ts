import { Component, Input, Output, OnInit, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { RecordingService } from 'src/app/pages/recording-screen/recording.service';
import { HeaderService } from './header.service';
import { fadeAnimation } from '../../shared/app.animation';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [fadeAnimation],
})
export class HeaderComponent implements OnInit, OnChanges {
  showSide: boolean = true;
  fullScreen: boolean = false;
  val: number;
  recordingDuration: any = '00:00';
  @Input() onFinishRecording: boolean;
  @Input() onScreenShot: boolean;
  @Input() sidebarOpen: boolean;
  @Input() ontakeScreenshot: boolean;
  @Input() videoScreen: boolean = false;
  @Output() show = new Subject();
  @Output() flashToggled = new Subject();
  @Input() checkedFlash: boolean = false;
  @Input() checkedMic: boolean = true;
  @Input() endscreen: boolean = false;

  constructor(
    public translate: TranslateService,
    private recordingService: RecordingService,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.fullScreen = this.recordingService.fullscreen;

    this.recordingService.recordTimeDuration.subscribe((res) => {
      this.recordingDuration = res;
    });
    this.muteUnmuteToggle();
  }

  onShow() {
    this.show.next(this.showSide);
  }

  fullscreen() {
    this.headerService.videoFullscreen.next(true);
    this.fullScreen = true;
  }

  closescreen() {
    this.headerService.videoFullscreen.next(false);
    this.fullScreen = false;
  }

  muteUnmuteToggle() {
    this.headerService.muteMic = this.checkedMic;
    this.headerService.muteUnmuteMic.next(this.checkedMic);
  }

  flashedToggle() {
    this.headerService.flash = this.checkedFlash;
    this.headerService.flashToggled.next(this.checkedFlash);
  }
}
