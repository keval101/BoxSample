import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { HeaderService } from 'src/app/features/header/header.service';
import { fadeAnimation } from '../../shared/app.animation';
import { EvolutionService } from '../evaluation/evolution.service';
import { SetupService } from './setup.service';
declare var ImageCapture: any;
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
  checkedMic: boolean = true;
  checkedFlash: boolean = false;
  sidebar: boolean;
  deviceID: any;
  videoStream: any;
  camera: any[] = [];
  @ViewChild('video') video: any;
  @ViewChild('value') drop: ElementRef;
  deviceInfoId: any;
  track: any;
  deviceLabel: any;
  flashSubject = new Subject();
  cancelText: string;
  userAgent: any;

  constructor(
    private router: Router,
    public TranslateService: TranslateService,
    private headerService: HeaderService,
    private setupService: SetupService,
    private confirmationService: ConfirmationService,
    private evolutionService: EvolutionService
  ) {
    this.TranslateService.get('setup.cancelText').subscribe((text: string) => {
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
    this.onResize(window.innerWidth);

    setTimeout(() => {
      this.cameraChange();
    }, 500);
  }

  dropValue(event) {
    this.setupService.cameraId.next(event.Id);
    this.setupService.cameraIdInformation = event.Id;
  }

  getDevice() {
    let _video = this.video.nativeElement;
    let tempThis = this;

    if ((<any>window).stream) {
      (<any>window).stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      // Create stream and get video track
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            deviceId: tempThis.deviceInfoId
              ? { exact: tempThis.deviceInfoId }
              : undefined,
          },
        })
        .then((stream) => {
          _video.volume = 0;
          (<any>window).stream = stream;
          this.videoStream = stream;
          _video.srcObject = stream;
          _video.onloadedmetadata = function (e: any) {};
          _video.play();

          this.camera = [];

          navigator.mediaDevices.enumerateDevices().then((devices) => {
            devices.forEach(function (device) {
              if (device.kind === 'videoinput') {
                tempThis.camera.push({
                  label: device.label,
                  Id: device.deviceId,
                });
                tempThis.deviceID = device.deviceId;
              }
            });
          });

          this.track = stream.getVideoTracks()[0];
          //Create image capture object and get camera capabilities
          if (/android/i.test(this.userAgent)) {
            alert('Android');
            const imageCapture = new ImageCapture(this.track);
            const photoCapabilities = imageCapture
              .getPhotoCapabilities()
              .then(() => {
                let tempThis = this;

                this.headerService.flashToggled.subscribe((flashValue) => {
                  tempThis.track.applyConstraints({
                    advanced: [{ torch: flashValue }],
                  });
                });
              });
          }
        });
    });
  }

  cameraChange() {
    this.setupService.cameraId.subscribe((res) => {
      this.deviceInfoId = res;
      this.getDevice();
    });
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this.getDevice();
    }
  }

  showDetail() {
    this.sidebar = !this.sidebar;
  }

  onResize(event) {
    let width = event;
    if (width <= 600) {
      this.sidebar = false;
    } else {
      this.sidebar = true;
    }
  }

  muteUnmuteToggle() {
    this.headerService.muteMic = this.checkedMic;
    this.headerService.muteUnmuteMic.next(this.checkedMic);
  }

  flashToggle() {
    this.headerService.flash = this.checkedFlash;
    this.headerService.flashToggled.next(this.checkedFlash);
  }

  redirectTo() {
    this.router.navigate(['/recording']);
  }

  redirectToBack() {
    this.router.navigate(['/video']);
  }

  closeSidebar() {
    if (window.innerWidth < 600) {
      this.sidebar = false;
    }
  }

  confirm() {
    this.confirmationService.confirm({
      message: this.cancelText,

      accept: () => {
        this.evolutionService.cancelValue = true;
        this.router.navigate(['/end']);
      },
    });
  }

  ngOnDestroy() {
    if ((<any>window).stream) {
      (<any>window).stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }
}
