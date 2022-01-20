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
import { NgxOpenCVService, OpenCVState } from 'ngx-opencv';

declare let MediaRecorder;
declare const window: Window &
  typeof globalThis & {
    stream: MediaStream;
  };
declare var cv:any;

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
  isDetection:boolean;
  examType:string="";
  @ViewChild('video') videoEle: ElementRef;
  @ViewChild('videoPreview') recordedVideoEle: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('sidenav') sidenav: ElementRef;
  @ViewChild('videoFrame') videoFrame: ElementRef;
  @ViewChild('detection') detection: ElementRef;
  @ViewChild('circlePopup') circlePopup: ElementRef;
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
    private _sanitizer: DomSanitizer,
    private ngxOpenCvService:NgxOpenCVService
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
      #sidebar__content h1 {font-size: ${this.branding.sidebarTitle.fontSize} !important;color: ${this.branding.sidebarTitle.color};font-weight: ${this.branding.sidebarTitle.fontWeight};font-family: ${this.branding.sidebarTitle.fontFamily};}
      #sidebar__content h2 {font-size: ${this.branding.contentTextTitle.fontSize};color: ${this.branding.contentTextTitle.color};font-weight: ${this.branding.contentTextTitle.fontWeight};font-family: ${this.branding.contentTextTitle.fontFamily};}
      #sidebar__content p {font-size: ${this.branding.contentText.fontSize} ;color: ${this.branding.contentText.color} ;font-weight: ${this.branding.contentText.fontWeight};font-family: ${this.branding.contentText.fontFamily};}
      #sidebar__content ul{font-size: ${this.branding.contentText.fontSize} ;color: ${this.branding.contentText.color} ;font-weight: ${this.branding.contentText.fontWeight};font-family: ${this.branding.contentText.fontFamily};}
      .p-dialog.p-confirm-dialog .p-confirm-dialog-message{font-size: ${this.branding.contentText.fontSize} !important;color: ${this.branding.contentText.color};font-weight: ${this.branding.contentText.fontWeight};font-family: ${this.branding.contentText.fontFamily};}
      .p-inputswitch.p-inputswitch-checked .p-inputswitch-slider:before {background: ${this.branding.UIElementSecondColor} !important; }
      .header__left--duration-icon{color: ${this.branding.UIElementRecording} !important; }
      .p-inputswitch .p-inputswitch-slider:before {background: ${this.branding.UIElementPrimaryColor} !important; }</style>`
    );
    this.randomNum = uuidv4();
    this.ngxOpenCvService.cvState.subscribe((cvState:OpenCVState)=>{
      if(cvState.ready){
        this.initRecording();
      }
    }) 
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
    this.isDetection = false;
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
  context;
  detectCircle(){
    this.context = this.videoFrame.nativeElement.getContext('2d');
    this.context.canvas.width = this.videoEle.nativeElement.offsetWidth;
    this.context.canvas.height = this.videoEle.nativeElement.offsetHeight;
    this.context.drawImage(this.videoEle.nativeElement,0,0,this.videoEle.nativeElement.offsetWidth,this.videoEle.nativeElement.offsetHeight);
    let src = cv.imread('videoFrame');
    this.processImage(src);
    
    // if(this.isDetection){
    requestAnimationFrame(this.detectCircle.bind(this));
    // }
  }
  processImage(src){
    let detectionContext = this.detection.nativeElement.getContext('2d');
    detectionContext.canvas.width = this.videoEle.nativeElement.offsetWidth;
    detectionContext.canvas.height = this.videoEle.nativeElement.offsetHeight;
    detectionContext.clearRect(0,0,this.videoEle.nativeElement.offsetWidth,this.videoEle.nativeElement.offsetHeight);
    
    let dst = cv.imread('detection');
    //Convert into Gray Color
    cv.cvtColor(src,src,cv.COLOR_RGBA2GRAY);
    //Blur Image
    cv.medianBlur(src,src,3);
    
    let circles = new cv.Mat();

    let redColor = new cv.Scalar(255,0,0,255);
    let greenColor = new cv.Scalar(0,255,0,255);
    
    cv.HoughCircles(src,circles,cv.HOUGH_GRADIENT,1,100,90,90);

    let circleArray = [];

    if(circles.cols === 0){
      this.circlePopup.nativeElement.style.visibility = "visible";
      this.circlePopup.nativeElement.innerHTML = "Please place circular gauze into the middle of your camera view";
    }else{
      for(let i = 0; i < circles.cols; ++i) {
        let x = circles.data32F[i * 3];
        let y = circles.data32F[i * 3 + 1];
        let radius = circles.data32F[i * 3 + 2];
        let center = new cv.Point(x, y);
        let smallCircle = new cv.Mat();
        let bigCircle = new cv.Mat();
        cv.HoughCircles(src,smallCircle,cv.HOUGH_GRADIENT,1,100,70,70,0,radius-5);
        cv.HoughCircles(src,bigCircle,cv.HOUGH_GRADIENT,1,100,70,70,radius+5);
        if(smallCircle.cols>0 || bigCircle.cols>0){
          this.examType = "Practice";
        }else{
          this.examType = "Exam";
        }
        console.log(bigCircle.cols)
        let maxRadius = bigCircle.cols>0?75:100;
        console.log(maxRadius)
        if(radius<maxRadius){
          
          // circleArray.push({center:center,radius:radius,color:redColor});
          if(bigCircle.cols>0){
            for(let b = 0; b < bigCircle.cols; ++b) {
              let bx = bigCircle.data32F[b * 3];
              let by = bigCircle.data32F[b * 3 + 1];
              let bradius = bigCircle.data32F[b * 3 + 2];
              let bcenter = new cv.Point(bx, by);
              cv.circle(dst, bcenter, bradius, redColor,2);
              // circleArray.push({center:bcenter,radius:bradius,color:redColor});
            }
          }
          if(smallCircle.cols>0){
            for(let s = 0; s < smallCircle.cols; ++s) {
              let sx = smallCircle.data32F[s * 3];
              let sy = smallCircle.data32F[s * 3 + 1];
              let sradius = smallCircle.data32F[s * 3 + 2];
              let scenter = new cv.Point(sx, sy);
              cv.circle(dst, scenter, sradius, redColor,2);
              // circleArray.push({center:scenter,radius:sradius,color:redColor});
            }
          }
          cv.circle(dst, center, radius, redColor,2);
          this.circlePopup.nativeElement.style.visibility = "visible";
          this.circlePopup.nativeElement.innerHTML = "Please bring the gauze closer to your camera view";
        }else{
          // circleArray.push({center:center,radius:radius,color:greenColor});
          
          let leftEdge = this.videoEle.nativeElement.offsetWidth*20/100;
          let rightEdge = this.videoEle.nativeElement.offsetWidth*80/100;
          let circleLeftX = x-radius;
          let circleRightX = x+radius;
          let color;
          if(circleLeftX > leftEdge && circleRightX < rightEdge){
            this.circlePopup.nativeElement.style.visibility = "visible";
            this.circlePopup.nativeElement.innerHTML = "Now start performing your "+this.examType.toLowerCase()+" circular cutting task";
            color = greenColor;
          }else{
            this.circlePopup.nativeElement.style.visibility = "visible";
            this.circlePopup.nativeElement.innerHTML = "Please position your gauze in the middle of your camera view";
            color = redColor;
          }
          if(bigCircle.cols>0){
            for(let b = 0; b < bigCircle.cols; ++b) {
              let bx = bigCircle.data32F[b * 3];
              let by = bigCircle.data32F[b * 3 + 1];
              let bradius = bigCircle.data32F[b * 3 + 2];
              let bcenter = new cv.Point(bx, by);
              cv.circle(dst, bcenter, bradius, color,2);
              // circleArray.push({center:bcenter,radius:bradius,color:greenColor});
            }
          }
          if(smallCircle.cols>0){
            for(let s = 0; s < smallCircle.cols; ++s) {
              let sx = smallCircle.data32F[s * 3];
              let sy = smallCircle.data32F[s * 3 + 1];
              let sradius = smallCircle.data32F[s * 3 + 2];
              let scenter = new cv.Point(sx, sy);
              cv.circle(dst, scenter, sradius, color,2);
              // circleArray.push({center:scenter,radius:sradius,color:greenColor});
            }
          }
          cv.circle(dst, center, radius, color,2);
        }
      }
    }
    // for(let c=0;c<circleArray.length;c++){
    //   cv.circle(dst, circleArray[c].center, circleArray[c].radius, circleArray[c].color,2);
    // }
    // console.log(examType)
    cv.imshow('detection', dst);
    src.delete();
    dst.delete();
  }
  async init(constraints: MediaStreamConstraints): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoTrack = stream.getVideoTracks()[0];
      this.audioTrack = stream.getAudioTracks()[0];
      this.handleSuccess(stream);
      this.isDetection = true;
      // setTimeout(()=>{
        this.detectCircle();
      // },9000)
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
    this.isDetection = false;
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
