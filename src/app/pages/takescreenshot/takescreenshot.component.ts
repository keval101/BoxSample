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
import { HeaderService } from 'src/app/features/header/header.service';
import { SetupService } from '../setup/setup.service';
import { TakescreenshotService } from './takescreenshot.service';
import { ConfirmationService } from 'primeng/api';
import { EvolutionService } from '../evaluation/evolution.service';
import { fadeAnimation } from 'src/app/shared/app.animation';

declare const window: Window &
  typeof globalThis & {
    stream: MediaStream;
  };

@Component({
  selector: 'app-takescreenshot',
  templateUrl: './takescreenshot.component.html',
  styleUrls: ['./takescreenshot.component.scss'],
  animations: [fadeAnimation],
})
export class TakescreenshotComponent implements OnInit, OnDestroy {
  recording: boolean;
  isScreenShot = true;
  takeScreenshot = false;
  onCameraClick = false;
  imageCapture = false;
  videoStream;
  fullscreen = false;
  deviceInfoId;
  @ViewChild('video') video: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('sidenav') sidenav: ElementRef;
  cancelText: string;
  isSidebarOpen = false;

  constructor(
    private router: Router,
    public TranslateService: TranslateService,
    private evolutionService: EvolutionService,
    private takescreenshotService: TakescreenshotService,
    private setupSerice: SetupService,
    private confirmationService: ConfirmationService,
    private headerService: HeaderService
  ) {
    this.TranslateService.get('takescreenshot.cancelText').subscribe(
      (text: string) => {
        this.cancelText = text;
      }
    );
    this.deviceInfoId = this.setupSerice.cameraIdInformation;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event): void {
    if (
      this.isSidebarOpen &&
      !this.sidenav.nativeElement.contains(event.target)
    ) {
      this.isSidebarOpen = false;
    }
  }

  ngOnInit(): void {
    this.headerService.videoFullscreen.subscribe((res) => {
      this.fullscreen = res;
    });
    this.recording = true;
    this.takeScreenshot = true;
  }

  ngAfterViewInit(): void {
    const _video = this.video.nativeElement;
    const deviceInfoId = this.deviceInfoId;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: deviceInfoId ? { exact: deviceInfoId } : undefined,
          },
        })
        .then((stream) => {
          window.stream = stream;
          this.videoStream = stream;
          _video.srcObject = stream;
          _video.play();
        });
    }
  }

  takeScreenShot(): void {
    this.onCameraClick = true;
    this.takeScreenshot = false;
    this.imageCapture = true;
    this.isScreenShot = false;
    this.canvas.nativeElement
      .getContext('2d')
      .drawImage(this.video.nativeElement, 0, 0, 640, 480);
  }

  onRetake(): void {
    this.fullscreen = false;
    this.takeScreenshot = true;
    this.onCameraClick = false;
    this.imageCapture = false;
    this.isScreenShot = true;
  }

  onSlidebarOpen(value: boolean): void {
    this.isSidebarOpen = value;
  }

  onSlidebarClose(): void {
    this.isSidebarOpen = false;
  }

  sidebarClose(event: boolean): void {
    if (!event) {
      this.isSidebarOpen = false;
    }
  }

  onDone(): void {
    this.router.navigate(['/choosescreenshot']);
    this.takescreenshotService.resultImageSource =
      this.canvas.nativeElement.toDataURL('image/png');
    this.takescreenshotService.captures.push(
      this.canvas.nativeElement.toDataURL('image/png')
    );
  }
  onCancelExersice(): void {
    this.confirmationService.confirm({
      message: this.cancelText,

      accept: () => {
        this.router.navigate(['/end']);
      },
    });
  }

  confirm(): void {
    this.confirmationService.confirm({
      message: this.cancelText,
      accept: () => {
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
