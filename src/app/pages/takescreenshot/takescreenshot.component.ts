import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from 'src/app/features/header/header.service';
import { SetupService } from '../setup/setup.service';
import { TakescreenshotService } from './takescreenshot.service';
import { ConfirmationService } from 'primeng/api';
import { EvolutionService } from '../evaluation/evolution.service';
import { fadeAnimation } from 'src/app/shared/app.animation';
import { DataService } from 'src/app/shared/shared/data.service';
import { UtilityService } from 'src/app/shared/shared/utility.service';
import { Subscription } from 'rxjs';

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
export class TakescreenshotComponent
  implements OnInit, OnDestroy, AfterViewInit
{
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
  indexDB;
  indexDbSubscription: Subscription;

  constructor(
    private router: Router,
    public translateService: TranslateService,
    private evolutionService: EvolutionService,
    private takescreenshotService: TakescreenshotService,
    private setupSerice: SetupService,
    private confirmationService: ConfirmationService,
    private headerService: HeaderService,
    private dataservice: DataService,
    private utility: UtilityService
  ) {
    this.dataservice.setLoader(true);
    this.translateService
      .get('takescreenshot.cancelText')
      .subscribe((text: string) => {
        this.cancelText = text;
      });
    this.deviceInfoId = this.setupSerice.cameraIdInformation;
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
            facingMode: 'environment',
            deviceId: deviceInfoId ? { exact: deviceInfoId } : undefined,
          },
        })
        .then((stream) => {
          window.stream = stream;
          this.videoStream = stream;
          _video.srcObject = stream;
          _video.play();
          this.dataservice.setLoader(false);
        });
    }
  }

  takeScreenShot(): void {
    this.headerService.videoFullscreen.next(false);
    this.onCameraClick = true;
    this.takeScreenshot = false;
    this.imageCapture = true;
    this.isScreenShot = false;
    const vidStyleData = this.video.nativeElement.getBoundingClientRect();
    this.canvas.nativeElement
      .getContext('2d')
      .drawImage(this.video.nativeElement, 0, 0, 640, 480);
    this.canvas.nativeElement.style.width = vidStyleData.width + 'px';
    this.canvas.nativeElement.style.height = vidStyleData.height + 'px';
    this.canvas.nativeElement.style.left = vidStyleData.left + 'px';
    this.canvas.nativeElement.style.top = vidStyleData.top + 'px';
  }

  onRetake(): void {
    this.headerService.videoFullscreen.next(false);
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
    this.headerService.isInfoOpen = false;
  }

  sidebarClose(event: boolean): void {
    if (!event) {
      this.isSidebarOpen = false;
    }
  }

  onDone(): void {
    this.dataservice.preserveQueryParams('/self-assesment');
    this.takescreenshotService.captures = this.utility.getImageBlob(
      this.canvas.nativeElement.toDataURL('image/png')
    );
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

  confirm(): void {
    this.confirmationService.confirm({
      message: this.cancelText,
      accept: () => {
        this.evolutionService.setCancelValue(true);
        this.router.navigate(['/end']);
      },
    });
  }
  ngOnDestroy(): void {
    if (this.indexDbSubscription) {
      this.indexDbSubscription.unsubscribe();
    }
    this.headerService.videoFullscreen.next(false);
    if (window.stream) {
      window.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  get appData() {
    return this.dataservice.appData;
  }
}
