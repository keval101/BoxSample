import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { HeaderService } from 'src/app/features/header/header.service';
import { UtilityService } from 'src/app/shared/shared/utility.service';
import { fadeAnimation } from '../../shared/app.animation';
import { EvolutionService } from '../evaluation/evolution.service';
import { SetupService } from './setup.service';
declare let ImageCapture;

declare const window: Window &
  typeof globalThis & {
    stream: MediaStream;
  };
@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
  animations: [fadeAnimation],
})
export class SetupComponent implements OnInit, OnDestroy {
  recording: boolean;
  isScreenShot: boolean;
  selectedCamera: boolean;
  checkedMic = true;
  checkedFlash = false;
  sidebar: boolean;
  deviceID;
  videoStream;
  flashoff: boolean;
  camera = [];
  @ViewChild('video') video;
  @ViewChild('value') drop: ElementRef;
  deviceInfoId;
  track;
  deviceLabel;
  flashSubject = new Subject();
  cancelText: string;
  userAgent;

  setupScreen = true;
  @ViewChild('sidenav') sidenav: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    const w = event.target as Window;
    const width = w.innerWidth;
    if (width <= 600) {
      this.sidebar = false;
    } else {
      this.sidebar = true;
    }
  }

  constructor(
    private router: Router,
    public translateService: TranslateService,
    private headerService: HeaderService,
    private setupService: SetupService,
    private confirmationService: ConfirmationService,
    private evolutionService: EvolutionService,
    public utility: UtilityService
  ) {
    this.translateService.get('setup.cancelText').subscribe((text: string) => {
      this.cancelText = text;
    });

    this.headerService.muteUnmuteMic.subscribe(
      (res) => (this.checkedMic = res)
    );
    this.userAgent = navigator.userAgent;
  }

  ngOnInit(): void {
    this.isScreenShot = true;
    this.recording = true;

    if (window.innerWidth > 600) {
      this.sidebar = true;
    } else {
      this.sidebar = false;
    }
    this.checkDeviceWidth(window.innerWidth);

    setTimeout(() => {
      this.cameraChange();
    }, 500);
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event): void {
    if (window.innerWidth < 600) {
      if (this.sidebar && !this.sidenav.nativeElement.contains(event.target)) {
        this.sidebar = false;
      }
    }
  }
  dropValue(event: { Id }): void {
    this.setupService.cameraId.next(event.Id);
    this.setupService.cameraIdInformation = event.Id;
  }

  getDevice(): void {
    const _video = this.video.nativeElement;
    const deviceInfoId = this.deviceInfoId;
    let deviceID = this.deviceID;
    const tempThis = this;
    if (window.stream) {
      window.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    navigator.mediaDevices.enumerateDevices().then(() => {
      // Create stream and get video track
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            facingMode: 'environment',
            deviceId: deviceInfoId ? { exact: deviceInfoId } : undefined,
          },
        })
        .then((stream) => {
          window.stream = stream;
          this.videoStream = stream;
          _video.srcObject = stream;
          // _video.onloadedmetadata = function () {};
          _video.play();
          this.video.nativeElement.volume = 0;
          this.camera = [];

          navigator.mediaDevices.enumerateDevices().then((devices) => {
            devices.forEach((device) => {
              if (device.kind === 'videoinput') {
                tempThis.camera.push({
                  label: device.label,
                  Id: device.deviceId,
                });
                deviceID = device.deviceId;
              }
            });
          });

          this.track = stream.getVideoTracks()[0];
          //Create image capture object and get camera capabilities
          if (/android/i.test(this.userAgent)) {
            const imageCapture = new ImageCapture(this.track);
            imageCapture.getPhotoCapabilities().then(() => {
              // let tempThis = this;
              const track = this.track;
              this.headerService.flashToggled.subscribe((flashValue) => {
                track.applyConstraints({
                  advanced: [{ torch: flashValue }],
                });
              });
            });
          }
        });
    });
  }

  cameraChange(): void {
    this.setupService.cameraId.subscribe((res) => {
      this.deviceInfoId = res;
      this.getDevice();
    });
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this.getDevice();
    }
  }

  showDetail(): void {
    this.sidebar = !this.sidebar;
  }

  checkDeviceWidth(width: number): void {
    if (width <= 600) {
      this.sidebar = false;
    } else {
      this.sidebar = true;
    }
  }

  muteUnmuteToggle(): void {
    this.headerService.muteMic = this.checkedMic;
    this.headerService.muteUnmuteMic.next(this.checkedMic);
  }

  flashToggle(): void {
    this.headerService.flash = this.checkedFlash;
    this.headerService.flashToggled.next(this.checkedFlash);
  }

  redirectTo(): void {
    this.router.navigate(['/recording']);
  }

  redirectToBack(): void {
    this.router.navigate(['/video']);
  }

  closeSidebar(): void {
    if (window.innerWidth < 600) {
      this.sidebar = false;
    }
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
    if (window.stream) {
      window.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }
}
