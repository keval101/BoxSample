import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RecordingService } from './recording.service';
import { fadeAnimation } from '../../shared/app.animation';
import { interval, Subscription, timer } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HeaderService } from 'src/app/features/header/header.service';
import { Platform } from '@angular/cdk/platform';
import { SetupService } from '../setup/setup.service';
import { TakescreenshotService } from '../takescreenshot/takescreenshot.service';
import { ConfirmationService } from 'primeng/api';
import { EvolutionService } from '../evaluation/evolution.service';
import { DataService } from 'src/app/shared/shared/data.service';
import { UtilityService } from 'src/app/shared/shared/utility.service';
import { v4 as uuidv4 } from 'uuid';
import { environment } from 'src/environments';

declare let MediaRecorder;
declare const window: Window &
  typeof globalThis & {
    stream: MediaStream;
  };

@Component({
  selector: 'app-recording-screen',
  templateUrl: './recording-screen.component.html',
  styleUrls: ['./recording-screen.component.scss'],
  animations: [fadeAnimation],
})
export class RecordingScreenComponent implements OnInit, OnDestroy {
  recording = false;
  isScreenShot = false;
  takeScreenshot = false;
  isSidebarOpen = false;
  counterTime = false;
  recordingFinish = false;
  isRunning: boolean;
  videoSource;
  paddingClass: boolean;
  recordingDurationTime: string;
  data = [3, 2, 1, 'go'];
  counter;
  micValue: boolean;
  mediaRecorder;
  recordedBlobs;
  options;
  micCheckedValue: boolean;
  recordedType;
  videoTrack;
  audioTrack;
  time = 0;
  displayTimer;
  videoType;
  deviceInfoId;
  videoTimer: Subscription;
  flashCheckedValue = false;
  isFullScreen: boolean;
  cancelText: string;
  indexDB;
  indexDbSubscription: Subscription;
  startRecordingTime;
  myStyle: SafeHtml;
  brand = environment.branding;

  @ViewChild('video') videoEle: ElementRef;
  @ViewChild('videoPreview') recordedVideoEle: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('sidenav') sidenav: ElementRef;
  randomNum: string;

  constructor(
    public translateService: TranslateService,
    private router: Router,
    private recordingService: RecordingService,
    private sanitizer: DomSanitizer,
    private headerService: HeaderService,
    private setupSerice: SetupService,
    public platform: Platform,
    private dataservice: DataService,
    private takescreenshotService: TakescreenshotService,
    private confirmationService: ConfirmationService,
    private utility: UtilityService,
    private evolutionService: EvolutionService,
    private _sanitizer: DomSanitizer
  ) {
    this.headerService.muteUnmuteMic.subscribe((res) => {
      this.micValue = res;
      this.muteVideo();
    });
    this.deviceInfoId = this.setupSerice.cameraIdInformation;

    this.headerService.videoFullscreen.subscribe((fullscreenValue) => {
      this.isFullScreen = fullscreenValue;
    });
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event): void {
    if (
      this.isSidebarOpen &&
      !this.sidenav.nativeElement.contains(event.target)
    ) {
      this.isSidebarOpen = false;
      this.headerService.isInfoOpen = false;
    }
  }

  ngOnInit(): void {
    this.myStyle = this._sanitizer.bypassSecurityTrustHtml(
      `<style>
      #sidebar__content h1 {font-size: ${this.branding.generalConfig.contentTitle.fontSize} !important;color: ${this.branding.generalConfig.contentTitle.color};font-weight: ${this.branding.generalConfig.contentTitle.fontWeight};font-family: ${this.branding.generalConfig.contentTitle.fontFamily};}
      #sidebar__content h2 {font-size: ${this.branding.generalConfig.contentTextTitle.fontSize};color: ${this.branding.generalConfig.contentTextTitle.color};font-weight: ${this.branding.generalConfig.contentTextTitle.fontWeight};font-family: ${this.branding.generalConfig.contentTextTitle.fontFamily};}
      #sidebar__content p {font-size: ${this.branding.generalConfig.contentText.fontSize} ;color: ${this.branding.generalConfig.contentText.color} ;font-weight: ${this.branding.generalConfig.contentText.fontWeight};font-family: ${this.branding.generalConfig.contentText.fontFamily};}
      #sidebar__content ul{font-size: ${this.branding.generalConfig.contentText.fontSize} ;color: ${this.branding.generalConfig.contentText.color} ;font-weight: ${this.branding.generalConfig.contentText.fontWeight};font-family: ${this.branding.generalConfig.contentText.fontFamily};}
      .p-dialog.p-confirm-dialog .p-confirm-dialog-message{font-size: ${this.branding.generalConfig.contentText.fontSize} !important;color: ${this.branding.generalConfig.contentText.color};font-weight: ${this.branding.generalConfig.contentText.fontWeight};font-family: ${this.branding.generalConfig.contentText.fontFamily};}
      .p-inputswitch.p-inputswitch-checked .p-inputswitch-slider:before {background: ${this.branding.generalConfig.UIElementSecondColor} !important; }
      .p-inputswitch .p-inputswitch-slider:before {background: ${this.branding.generalConfig.UIElementPrimaryColor} !important; }</style>`
    );
    this.randomNum = uuidv4();
    this.initRecording();
  }

  initRecording() {
    this.translateService
      .get('recordingPage.cancelText')
      .subscribe((text: string) => {
        this.cancelText = text;
      });

    // const obs = interval(1000);
    // const timerSub: Subscription = obs.subscribe((d) => {
    //   // this.counterTime = true;
    //   const counterText = this.data[d];
    //   this.counter = counterText;
    // });
    setTimeout(() => {
      this.startCamera();
    }, 500);
    this.micCheckedValue = this.headerService.muteMic;
    this.flashCheckedValue = this.headerService.flash;
    this.recordingDurationTime = '00:00';
  }
  onFinish(): void {
    this.recordingService.fullscreen = false;
    this.isSidebarOpen = false;
    this.isRunning = false;
    this.stopRecording();
    setTimeout(() => {
      this.recordingFinish = true;
    }, 1000);
    this.videoTrack.stop();
    this.audioTrack.stop();

    this.dataservice.preserveQueryParams('/takescreenshot');
  }

  onSlidebarOpen(value: boolean): void {
    this.isSidebarOpen = value;
  }

  onSlidebarClose(): void {
    this.isSidebarOpen = false;
    this.headerService.isInfoOpen = false;
  }

  playVideo(): void {
    if (this.platform.SAFARI) {
      this.recordedType = { type: 'video/mp4' };
    } else {
      this.recordedType = { type: 'video/webm' };
    }
    const superBuffer = new Blob(this.recordedBlobs, this.recordedType);
    this.videoSource = window.URL.createObjectURL(superBuffer);
  }

  muteVideo(): void {
    if (window.stream && window.stream.getAudioTracks().length > 0) {
      window.stream.getAudioTracks()[0].enabled =
        !window.stream.getAudioTracks()[0].enabled;
    }
  }

  handleDataAvailable(event: { data }): void {
    const table = [];
    if (event.data && event.data.size > 0) {
      table.push(event.data);
    }
    this.recordedBlobs = table;
  }

  startRecording(): void {
    this.startRecordingTime = new Date(new Date().toUTCString()).toISOString();
    this.stopwatch();
    this.isRunning = true;
    this.videoEle.nativeElement.volume = 0;
    if (this.platform.SAFARI) {
      this.options = { mimeType: 'video/mp4' };
      this.videoType = { type: 'video/mp4' };
    } else {
      this.options = { mimeType: 'video/webm' };
      this.videoType = { type: 'video/webm' };
    }
    try {
      this.mediaRecorder = new MediaRecorder(window.stream, this.options);
    } catch (e) {
      console.error('Exception while creating MediaRecorder:', e);
      return;
    }
    this.mediaRecorder.onstop = (event) => {
      const endRecordingTime = new Date(new Date().toUTCString()).toISOString();

      this.dataservice.recordingStartTime = this.startRecordingTime;
      this.dataservice.recordingEndTime = endRecordingTime;

      this.recordedBlobs = event.target.recordedBlobs;
      const superBuffer = new Blob(this.recordedBlobs, this.videoType);
      this.dataservice.videoData = {
        mimeType: this.videoType.type,
        blob: superBuffer,
      };
      const reader = new FileReader();
      reader.readAsDataURL(superBuffer);
      reader.onloadend = () => {
        const base64data = reader.result;
        this.dataservice.displayTimer = this.displayTimer;
        this.videoSource = this.sanitizer.bypassSecurityTrustResourceUrl(
          URL.createObjectURL(this.dataservice.videoData.blob)
        );
      };
    };

    this.mediaRecorder.ondataavailable = this.handleDataAvailable;
    this.mediaRecorder.start();
  }

  stopwatch(): void {
    this.videoTimer = timer(0, 1000).subscribe(() => {
      if (this.isRunning) {
        this.time++;
        this.getDisplayTimer(this.time);
      }
    });
  }

  getDisplayTimer(time: number): void {
    let hours = '' + Math.floor(time / 3600);
    let minutes = '' + Math.floor((time % 3600) / 60);
    let seconds = '' + Math.floor((time % 3600) % 60);

    if (Number(hours) < 10) {
      hours = '0' + hours;
    } else {
      hours = '' + hours;
    }
    if (Number(minutes) < 10) {
      minutes = '0' + minutes;
    } else {
      minutes = '' + minutes;
    }
    if (Number(seconds) < 10) {
      seconds = '0' + seconds;
    } else {
      seconds = '' + seconds;
    }

    this.displayTimer = minutes + ':' + seconds;
    this.recordingDurationTime = this.displayTimer;
    this.recordingService.finalRecordDuration = this.displayTimer;
    this.recordingService.recordTimeDuration.next(this.displayTimer);
  }

  stopRecording(): void {
    this.mediaRecorder.stop();
  }

  pauseRecording(): void {
    this.mediaRecorder.pause();
  }

  resumeRecording(): void {
    this.mediaRecorder.start();
  }

  handleSuccess(stream: MediaStream): void {
    window.stream = stream;
    const gumVideo = this.videoEle.nativeElement;
    gumVideo.srcObject = stream;
  }

  async init(constraints: MediaStreamConstraints): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoTrack = stream.getVideoTracks()[0];
      this.audioTrack = stream.getAudioTracks()[0];
      this.handleSuccess(stream);
      return null;
    } catch (e) {
      console.error('navigator.getUserMedia error:', e);
      return null;
    }
  }

  async startCamera(): Promise<void> {
    this.videoEle.nativeElement.volume = 0;
    const constraints: MediaStreamConstraints = {
      audio: {
        echoCancellation: true,
      },
      video: {
        facingMode: 'environment',
        deviceId: this.deviceInfoId ? { exact: this.deviceInfoId } : undefined,
      },
    };
    await this.init(constraints);
    this.counterTime = true;
    clearTimeout(this.dataservice.intervalId);
    this.dataservice.intervalId = setTimeout(() => {
      this.startRecording();
      this.paddingClass = true;
      this.counterTime = false;
      setTimeout(() => {
        if (this.headerService.muteMic === false) {
          if (window.stream.getAudioTracks().length > 0) {
            window.stream.getAudioTracks()[0].enabled = false;
          }
        }
      }, 100);
    }, 9000);
  }

  videoInitialize(): void {
    this.headerService.muteUnmuteMic.subscribe((res) => {
      this.micValue = res;
    });
  }

  takescreenshot(): void {
    this.isScreenShot = true;

    setTimeout(() => {
      this.isScreenShot = false;
    }, 3000);
    this.canvas.nativeElement
      .getContext('2d')
      .drawImage(this.videoEle.nativeElement, 0, 0, 640, 480);

    const vidStyleData = this.videoEle.nativeElement.getBoundingClientRect();
    this.canvas.nativeElement.style.width = vidStyleData.width + 'px';
    this.canvas.nativeElement.style.height = vidStyleData.height + 'px';
    this.canvas.nativeElement.style.left = vidStyleData.left + 'px';
    this.canvas.nativeElement.style.top = vidStyleData.top + 'px';

    this.recordingService.sceenShots.push(
      this.utility.getImageBlob(
        this.canvas.nativeElement.toDataURL('image/png')
      )
    );
  }

  // redirectToPhoto(): void {
  //   this.dataservice.preserveQueryParams('/takescreenshot');
  // }

  confirm(): void {
    if (this.paddingClass) {
      this.confirmationService.confirm({
        message: this.cancelText,
        accept: () => {
          this.evolutionService.setCancelValue(true);
          this.router.navigate(['/end']);
        },
      });
    } else {
      this.dataservice.preserveQueryParams('/setup');
    }
  }
  onCancelExersice(): void {
    this.confirmationService.confirm({
      message: this.cancelText,
      accept: () => {
        this.evolutionService.setCancelValue(true);
        this.router.navigate(['/end']);
      },
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.dataservice.intervalId);
    if (
      !this.appData.recordingPath &&
      window.stream &&
      window.stream.getTracks()
    ) {
      this.headerService.videoFullscreen.next(false);
      window.stream.getTracks()[0].stop();
      if (this.videoTimer) {
        this.videoTimer.unsubscribe();
      }
    }
  }

  get appData() {
    return this.dataservice.appData;
  }

  get branding() {
    return this.dataservice.branding;
  }
}
