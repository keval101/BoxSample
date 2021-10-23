import { Component, Input, Output, OnChanges, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { RecordingService } from 'src/app/pages/recording-screen/recording.service';
import { HeaderService } from './header.service';
import { fadeAnimation } from '../../shared/app.animation';
import { UtilityService } from 'src/app/shared/shared/utility.service';
import { DataService } from '../../shared/shared/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [fadeAnimation],
})
export class HeaderComponent implements OnChanges, OnInit {
  showSide = true;
  isCancel = true;
  fullScreen = false;
  flashoff: boolean;
  val: number;

  recordingDuration = '00:00';
  @Input() onFinishRecording: boolean;
  @Input() introScreen: boolean;
  @Input() setupScreen: boolean;
  @Input() onScreenShot: boolean;
  @Input() sidebarOpen: boolean;
  @Input() ontakeScreenshot: boolean;
  @Input() videoScreen = false;
  @Output() show = new Subject<boolean>();
  @Input() checkedMic = true;
  @Input() checkedFlash = false;
  @Input() endscreen = false;
  @Output() cancelExe = new Subject();
  constructor(
    public translate: TranslateService,
    private recordingService: RecordingService,
    private headerService: HeaderService,
    private dataService: DataService,
    public utility: UtilityService
  ) {}

  ngOnChanges(): void {
    this.fullScreen = this.recordingService.fullscreen;
    this.recordingService.recordTimeDuration.subscribe((res: string) => {
      this.recordingDuration = res;
    });
    this.muteUnmuteToggle();
  }

  ngOnInit() {}

  onShow(event: Event): void {
    event.stopPropagation();
    this.show.next(this.showSide);
    this.headerService.isInfoOpen = true;
  }

  cancelExercise(): void {
    this.cancelExe.next(this.isCancel);
  }

  get showInfo(): boolean {
    return this.headerService.isInfoOpen;
  }

  get appData() {
    return JSON.parse(this.dataService.getSessionData('caseData'));
  }

  fullscreen(): void {
    this.headerService.videoFullscreen.next(true);
    this.fullScreen = true;
  }

  closescreen(): void {
    this.headerService.videoFullscreen.next(false);
    this.fullScreen = false;
  }

  muteUnmuteToggle(): void {
    this.headerService.muteMic = this.checkedMic;
    this.headerService.muteUnmuteMic.next(this.checkedMic);
  }

  flashedToggle(): void {
    this.headerService.flash = this.checkedFlash;
    this.headerService.flashToggled.next(this.checkedFlash);
  }
}
