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
import { DataService } from 'src/app/shared/shared/data.service';
import { UtilityService } from 'src/app/shared/shared/utility.service';
import { fadeAnimation } from '../../shared/app.animation';
import { EvolutionService } from '../evaluation/evolution.service';
import { SetupService } from './setup.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  allowAccessText: string;
  userAgent;
  startExercise = true;
  myStyle: SafeHtml;

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
    private dataservice: DataService,
    public utility: UtilityService,
    private _sanitizer: DomSanitizer
  ) {
    this.translateService.get('setup').subscribe((text: any) => {
      this.cancelText = text.cancelText;
      this.allowAccessText = text.allowAccessMsg;
    });

    this.headerService.muteUnmuteMic.subscribe(
      (res) => (this.checkedMic = res)
    );
    this.userAgent = navigator.userAgent;
  }

  ngOnInit(): void {
    this.myStyle = this._sanitizer.bypassSecurityTrustHtml(
      `<style>
      #sidebar__content h1 {font-size: ${this.branding.generalConfig.sidebarTitle.fontSize};color: ${this.branding.generalConfig.sidebarTitle.color};font-weight: ${this.branding.generalConfig.sidebarTitle.fontWeight};font-family: ${this.branding.generalConfig.sidebarTitle.fontFamily};}
      #sidebar__content h2 {font-size: ${this.branding.generalConfig.contentTextTitle.fontSize};color: ${this.branding.generalConfig.contentTextTitle.color};font-weight: ${this.branding.generalConfig.contentTextTitle.fontWeight};font-family: ${this.branding.generalConfig.contentTextTitle.fontFamily};}
      #sidebar__content p {font-size: ${this.branding.generalConfig.contentText.fontSize} ;color: ${this.branding.generalConfig.contentText.color} ;font-weight: ${this.branding.generalConfig.contentText.fontWeight};font-family: ${this.branding.generalConfig.contentText.fontFamily};}
      #sidebar__content ul{font-size: ${this.branding.generalConfig.contentText.fontSize} ;color: ${this.branding.generalConfig.contentText.color} ;font-weight: ${this.branding.generalConfig.contentText.fontWeight};font-family: ${this.branding.generalConfig.contentText.fontFamily};}
      .p-dialog.p-confirm-dialog .p-confirm-dialog-message{font-size: ${this.branding.generalConfig.contentText.fontSize};color: ${this.branding.generalConfig.contentText.color};font-weight: ${this.branding.generalConfig.contentText.fontWeight};font-family: ${this.branding.generalConfig.contentText.fontFamily};}
      .p-inputswitch.p-inputswitch-checked .p-inputswitch-slider:before {background: ${this.branding.generalConfig.UIElementSecondColor} !important; }
      .p-inputswitch .p-inputswitch-slider:before {background: ${this.branding.generalConfig.UIElementPrimaryColor} !important; }</style>`
    );

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

  get appData() {
    return this.dataservice.appData;
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
          this.startExercise = false;
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
        })
        .catch((err) => {
          this.startExercise = true;
          this.onCancelAllowAccess();
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
    this.dataservice.preserveQueryParams('/recording');
  }

  redirectToBack(): void {
    this.dataservice.preserveQueryParams('/video');
  }

  closeSidebar(): void {
    if (window.innerWidth < 600) {
      this.sidebar = false;
    }
  }

  cancelDevicePopup() {
    this.evolutionService.setCancelValue(true);
    this.router.navigate(['/end']);
  }
  confirm(): void {
    this.confirmationService.confirm({
      message: this.cancelText,

      accept: () => {
        this.evolutionService.setCancelValue(true);
        this.router.navigate(['/end']);
      },
    });
  }

  confirmAllowAccess(): void {
    this.confirmationService.close();
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

  get branding() {
    return this.dataservice.branding;
  }

  onCancelAllowAccess(): void {
    this.confirmationService.confirm({
      message: this.allowAccessText,
      key: 'allowAccessDevice',
      accept: () => {
        this.evolutionService.setCancelValue(true);
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
