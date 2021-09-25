import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/features/header/header.service';
import { fadeAnimation } from '../../shared/app.animation';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { EvolutionService } from '../evaluation/evolution.service';

@Component({
  selector: 'app-videoscreen',
  templateUrl: './videoscreen.component.html',
  styleUrls: ['./videoscreen.component.scss'],
  animations: [fadeAnimation],
})
export class VideoscreenComponent implements OnInit, AfterViewInit {
  recording: boolean;
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
    private Translateservice: TranslateService,
    private confirmationService: ConfirmationService,
    private evolutionService: EvolutionService
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
<<<<<<< HEAD

  const video = document.getElementById('myvideo');
  
  video.addEventListener('loadstart', () => {
    this.isVideoLoaded = true;
  });
  video.addEventListener('canplay', () => {
    this.isVideoLoaded = false;
  });
=======
    const video = document.getElementById('myvideo');

    video.addEventListener('loadstart', () => {
      this.isVideoLoaded = true;
    });
    video.addEventListener('canplay', () => {
      this.isVideoLoaded = false;
    });
>>>>>>> 2710b7e41efb3230af0f50b4ade90aeb93a8e3b1
  }

  PlayVideo(): void {
    this.playVideo = false;
    this.video.nativeElement.pause();
  }

  PauseVideo(): void {
    this.isVideoLoaded = true;
    this.playVideo = true;
    this.video.nativeElement.play();
    this.video.nativeElement.onplaying = (e) => {
       this.isVideoLoaded = false;
    };
  }

  ngAfterViewInit(): void {
    if (this.video.nativeElement.pause) {
      this.playVideo = false;
    }
    this.video.nativeElement.addEventListener('timeupdate', () => {
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
    // if (e.cancelable) {
    //   e.preventDefault();
    // }
    this.val = e;
    this.video.nativeElement.volume = this.val / 100;
    if (this.val === 0) {
      this.isMuted = true;
    } else {
      this.isMuted = false;
    }
  }

  muteVolume(): void {
    this.isMuted = true;
    this.val = 0;
    this.video.nativeElement.volume = 0;
  }

  unMuteVolume(): void {
    this.isMuted = false;
    this.val = 30;
    this.video.nativeElement.volume = this.val / 100;
  }

  redirectToBack(): void {
    this.router.navigate(['/intro']);
  }

  redirectTo(): void {
    this.playVideo = false;
    this.video.nativeElement.pause();
    this.router.navigate(['/setup']);
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
}
