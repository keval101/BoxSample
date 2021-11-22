import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../../features/header/header.service';
import { fadeAnimation } from '../../shared/app.animation';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { EvolutionService } from '../evaluation/evolution.service';
import { DataService } from '../../shared/shared/data.service';
import { UtilityService } from 'src/app/shared/shared/utility.service';

@Component({
  selector: 'app-videoscreen',
  templateUrl: './videoscreen.component.html',
  styleUrls: ['./videoscreen.component.scss'],
  animations: [fadeAnimation],
})
export class VideoscreenComponent implements OnInit, AfterViewInit, OnDestroy {
  recording: boolean;
  loaderStart: boolean;
  isVideoScreen: boolean;
  playVideo: boolean;
  videoFullScreen = false;
  width: number;
  val = 30;
  mute = 0;
  isMuted = false;
  cancelText: string;
  isVideoLoaded: boolean;
  @ViewChild('video') video: ElementRef;

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private dataService: DataService,
    private Translateservice: TranslateService,
    private confirmationService: ConfirmationService,
    private evolutionService: EvolutionService,
    public utility: UtilityService
  ) {
    this.headerService.videoFullscreen.subscribe((res) => {
      if (res === true) {
        this.videoFullScreen = true;
      } else {
        this.videoFullScreen = false;
      }
    });
  }

  ngOnInit(): void {
    this.Translateservice.get('video.cancelText').subscribe((text: string) => {
      this.cancelText = text;
    });
    this.recording = true;
    this.isVideoScreen = true;
    this.width = window.innerWidth;

    const video = document.getElementById('myvideo');

    video.addEventListener('canplay', () => {
      this.dataService.setLoader(false);
    });
  }

  get appData() {
    return this.dataService.appData;
  }

  ngOnDestroy() {
    this.headerService.videoFullscreen.next(false);
  }

  PlayVideo(): void {
    this.playVideo = false;
    this.video.nativeElement.pause();
  }
  PauseVideo(): void {
    if (!this.loaderStart) {
      this.dataService.setLoader(true);
      this.loaderStart = true;
    }
    this.playVideo = true;
    this.video.nativeElement.play();
  }

  ngAfterViewInit(): void {
    if (this.video.nativeElement.pause) {
      this.playVideo = false;
    }
    this.video.nativeElement.addEventListener('timeupdate', () => {
      if (this.video.nativeElement.currentTime > 0) {
        this.dataService.setLoader(false);
      }
      const progressBar = document.getElementById('progressBar');
      const time =
        this.video.nativeElement.currentTime /
        this.video.nativeElement.duration;
      progressBar.style.width = time * 100 + '%';
      if (this.video.nativeElement.ended) {
        this.playVideo = false;
      }
    });

    document.getElementById('seekbar').addEventListener('click', (e) => {
      const progressTime =
        (e.offsetX / this.width) * this.video.nativeElement.duration;
      this.video.nativeElement.currentTime = progressTime;
    });
  }

  volumeChanged(e: number): void {
    this.val = e;
    this.video.nativeElement.volume = this.val / 100;
    if (this.val === 0) {
      this.isMuted = true;
      this.video.nativeElement.muted = true;
    } else {
      this.isMuted = false;
      this.video.nativeElement.muted = false;
    }
  }

  muteVolume(): void {
    this.isMuted = true;
    this.val = 0;
    this.video.nativeElement.muted = true;
  }

  unMuteVolume(): void {
    this.isMuted = false;
    this.val = 30;
    this.video.nativeElement.muted = false;
    this.video.nativeElement.volume = this.val / 100;
  }

  redirectToBack(): void {
    this.dataService.preserveQueryParams('/intro');
  }

  redirectTo(): void {
    this.playVideo = false;
    this.video.nativeElement.pause();
    this.dataService.preserveQueryParams('/setup');
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
}
