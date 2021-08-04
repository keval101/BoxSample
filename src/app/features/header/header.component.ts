import { Component, Input, Output, OnInit, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { RecordingService } from 'src/app/pages/recording-screen/recording.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnChanges {
  checkedMic: boolean = true;
  checkedFlash: boolean = false;
  showSide: boolean = true;
  fullScreen: boolean = false;

  @Input() onFinishRecording: boolean;
  @Input() onScreenShot: boolean;
  @Input() sidebarOpen: boolean;
  @Input() ontakeScreenshot: boolean;
  @Output() show = new Subject();

  constructor(
    public translate: TranslateService,
    private recordingService: RecordingService
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.fullScreen = this.recordingService.fullscreen;
  }
  onShow() {
    this.show.next(this.showSide);
  }

  fullscreen() {
    this.fullScreen = true;
  }

  closescreen() {
    this.fullScreen = false;
  }
}
