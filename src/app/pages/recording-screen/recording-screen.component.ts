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
import { DomSanitizer } from '@angular/platform-browser';
import { HeaderService } from 'src/app/features/header/header.service';
import { Platform } from '@angular/cdk/platform';
import { SetupService } from '../setup/setup.service';
import { TakescreenshotService } from '../takescreenshot/takescreenshot.service';
import { ConfirmationService } from 'primeng/api';
import { EvolutionService } from '../evaluation/evolution.service';
import { DataService } from 'src/app/shared/shared/data.service';
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

  @ViewChild('video') videoEle: ElementRef;
  @ViewChild('videoPreview') recordedVideoEle: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('sidenav') sidenav: ElementRef;

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
    private evolutionService: EvolutionService
  ) {
    setTimeout(() => {
      this.headerService.muteUnmuteMic.subscribe((res) => {
        this.micValue = res;
        this.muteVideo();
      });
    }, 4000);
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
    this.translateService
      .get('recordingPage.cancelText')
      .subscribe((text: string) => {
        this.cancelText = text;
      });

    const obs = interval(1000);
    const timerSub: Subscription = obs.subscribe((d) => {
      this.counterTime = true;
      const counterText = this.data[d];
      this.counter = counterText;

      if (d === 3) {
        this.paddingClass = true;
      }
    });
    setTimeout(() => {
      timerSub.unsubscribe();
      this.startRecording();
      this.counterTime = false;
      if (this.headerService.muteMic === false) {
        if (window.stream.getAudioTracks().length > 0) {
          window.stream.getAudioTracks()[0].enabled = false;
        }
      }
    }, 5000);
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
    if (window.stream.getAudioTracks().length > 0) {
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
      this.recordedBlobs = event.target.recordedBlobs;
      const superBuffer = new Blob(this.recordedBlobs, this.videoType);
      this.videoSource = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(superBuffer)
      );
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
    this.takescreenshotService.captures.push(
      this.canvas.nativeElement.toDataURL('image/png')
    );
    const vidStyleData = this.videoEle.nativeElement.getBoundingClientRect();
    this.canvas.nativeElement.style.width = vidStyleData.width + 'px';
    this.canvas.nativeElement.style.height = vidStyleData.height + 'px';
    this.canvas.nativeElement.style.left = vidStyleData.left + 'px';
    this.canvas.nativeElement.style.top = vidStyleData.top + 'px';
  }

  redirectToPhoto(): void {
    this.dataservice.preserveQueryParams('/takescreenshot');
  }

  confirm(): void {
    this.confirmationService.confirm({
      message: this.cancelText,
      accept: () => {
        this.evolutionService.cancelValue = true;
        this.router.navigate(['/end']);
      },
    });
  }
  onCancelExersice(): void {
    this.confirmationService.confirm({
      message: this.cancelText,
      accept: () => {
        this.evolutionService.cancelValue = true;
        this.router.navigate(['/end']);
      },
    });
  }

  ngOnDestroy(): void {
    this.headerService.videoFullscreen.next(false);
    window.stream.getTracks()[0].stop();
    setTimeout(() => {
      this.videoTimer.unsubscribe();
    }, 4000);
  }

  get appData() {
    return this.dataservice.appData;
  }
}
