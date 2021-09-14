import { Component, OnInit, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
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
declare var MediaRecorder: any;
@Component({
  selector: 'app-recording-screen',
  templateUrl: './recording-screen.component.html',
  styleUrls: ['./recording-screen.component.scss'],
  animations: [fadeAnimation],
})
export class RecordingScreenComponent implements OnInit, OnDestroy {
  recording: boolean = false;
  isScreenShot: boolean = false;
  takeScreenshot: boolean = false;
  isSidebarOpen: boolean = false;
  counterTime:boolean = false;
  recordingFinish:boolean = false;
  isRunning:boolean;
  videoSource:any;
  paddingClass:boolean;
  recordingDurationTime:string;
  data:any[] = [3,2,1,"go"]
  counter:any;
  micValue:boolean;
  mediaRecorder:any;
  recordedBlobs:any;
  options:any;
  micCheckedValue:boolean;
  recordedType:any;
  videoTrack:any;
  audioTrack:any;
  time:number = 0;
  displayTimer:any;
  videoType:any;
  deviceInfoId:any;
  videoTimer:Subscription;
  flashCheckedValue:boolean = false;
  isFullScreen:boolean;

  cancelText: string;


  @ViewChild('video') videoEle : ElementRef
  @ViewChild('videoPreview') recordedVideoEle : ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('sidenav') sidenav: ElementRef;

  constructor(
    public TranslateService: TranslateService,
    private router: Router,
    private recordingService: RecordingService,
    private sanitizer : DomSanitizer,
    private headerService : HeaderService,
    private setupSerice:SetupService,
    public platform: Platform,
    private takescreenshotService:TakescreenshotService,
    private confirmationService: ConfirmationService,
  ) { 
    setTimeout(() => {
      this.headerService.muteUnmuteMic.subscribe(
        res =>{
          this.micValue = res
          this.muteVideo()
        })
    }, 4000);  
    this.deviceInfoId = this.setupSerice.cameraIdInformation

    this.headerService.videoFullscreen.subscribe(
      fullscreenValue => {
        this.isFullScreen = fullscreenValue
      }
    )
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.isSidebarOpen && !this.sidenav.nativeElement.contains(event.target)) {
      this.isSidebarOpen = false;
    }
  }

  ngOnInit(): void {    
    this.TranslateService.get('recordingPage.cancelText').subscribe((text: string) => {
      this.cancelText = text;
    });

    const obs = interval(1000)
    const timer:Subscription = obs.subscribe( (d) => {
      this.counterTime = true;
      let counterText = this.data[d];
      this.counter = counterText

      if(d == 3){
        this.paddingClass = true
      }
    })
    setTimeout(() => {
        timer.unsubscribe()
        this.startRecording()
        this.counterTime = false;
        if(this.headerService.muteMic == false){
         if((<any>window).stream.getAudioTracks().length > 0){
          (<any>window).stream.getAudioTracks()[0].enabled = false
         }
        }
    }, 5000);
    setTimeout( () => {
    this.startCamera();
    },500)
    this.micCheckedValue = this.headerService.muteMic
    this.flashCheckedValue = this.headerService.flash
    this.recordingDurationTime = "00:00"  
  }

  onFinish() {
    this.recordingService.fullscreen = false;
    this.isSidebarOpen = false;
    this.isRunning = false;
    this.stopRecording();
    setTimeout(() => {
      this.recordingFinish = true;
    }, 1000);
    this.videoTrack.stop()
    this.audioTrack.stop()
  }

  onSlidebarOpen(value) {
    this.isSidebarOpen = value;
  }

  onSlidebarClose() {
    this.isSidebarOpen = false;
  }

  playVideo(){
    if(this.platform.SAFARI){
      this.recordedType = {type: 'video/mp4'};
    }else{ 
      this.recordedType = {type: 'video/webm'};
    }
    const superBuffer = new Blob(this.recordedBlobs, this.recordedType);
    this.videoSource = window.URL.createObjectURL(superBuffer);
  }
  
  muteVideo(){
    if((<any>window).stream.getAudioTracks().length > 0){
      (<any>window).stream.getAudioTracks()[0].enabled = !((<any>window).stream.getAudioTracks()[0].enabled)
    }
  }

  handleDataAvailable(event) {
    let table = []
    if (event.data && event.data.size > 0) {
      table.push(event.data);
    }
    this.recordedBlobs = table
  }

  startRecording(){
    this.stopwatch()
    this.isRunning = true
    this.videoEle.nativeElement.volume = 0
    if(this.platform.SAFARI){
      this.options = {mimeType: 'video/mp4'};
      this.videoType =  {type: 'video/mp4'};
    }else{ 
      this.options = {mimeType: 'video/webm'};
      this.videoType =  {type: 'video/webm'};
    }
    try {
     this.mediaRecorder = new MediaRecorder( (<any>window).stream, this.options);
    } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    return;
    }
    this.mediaRecorder.onstop = (event) => {
      this.recordedBlobs = event.target.recordedBlobs
      const superBuffer = new Blob(this.recordedBlobs, this.videoType);
      this.videoSource = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(superBuffer));
    };
    this.mediaRecorder.ondataavailable = this.handleDataAvailable;
    this.mediaRecorder.start();

    
  }

  stopwatch() {
     this.videoTimer =  timer(0, 1000).subscribe(() => {
      if (this.isRunning) {
        this.time++;
        this.getDisplayTimer(this.time);
      }
    });
  }

  getDisplayTimer(time: number) {
    var hours = '' + Math.floor(time / 3600);
    var minutes = '' + Math.floor(time % 3600 / 60);
    var seconds = '' + Math.floor(time % 3600 % 60);

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
    this.recordingDurationTime = this.displayTimer
    this.recordingService.recordTimeDuration.next(this.displayTimer)
  }

  stopRecording(){
    this.mediaRecorder.stop();
  }

  pauseRecording(){
    this.mediaRecorder.pause()
  }

  resumeRecording(){
    this.mediaRecorder.start()
  }

  handleSuccess(stream) {
    (<any>window).stream = stream;
    const gumVideo = this.videoEle.nativeElement;
    gumVideo.srcObject = stream;
  }

  async init(constraints) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
       this.videoTrack = stream.getVideoTracks()[0];
       this.audioTrack = stream.getAudioTracks()[0];
      this.handleSuccess(stream);
    } catch (e) {
      console.error('navigator.getUserMedia error:', e);
    }
  }
  
  async startCamera(){
    this.videoEle.nativeElement.volume = 0
    let tempThis = this;
    const constraints = {
      audio: {
        echoCancellation: true
      },
      video: {deviceId: tempThis.deviceInfoId ? {exact: tempThis.deviceInfoId} : undefined}
    };
    await this.init(constraints);
  }

  videoInitialize(){
      this.headerService.muteUnmuteMic.subscribe(
      res =>{
        this.micValue = res
      })
  }

  takescreenshot(){
    this.isScreenShot = true
  
    setTimeout(() => {
      this.isScreenShot = false
    }, 3000);
     var context = this.canvas.nativeElement.getContext("2d").drawImage(this.videoEle.nativeElement, 0, 0, 640, 480);
     this.takescreenshotService.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
    }

  redirectToPhoto(){
    this.router.navigate(['/takescreenshot']);
  }

  confirm() {   
    this.videoTimer.unsubscribe();
    this.mediaRecorder.pause();
    this.confirmationService.confirm({
      message: this.cancelText,
      accept: () => {
        this.router.navigate(['/setup']);
      },
      reject: () => {
        this.mediaRecorder.resume();
        setTimeout(() => {
          this.stopwatch()
        }, 2000);
      }
    });
  }
  onCancelExersice() {   
    this.videoTimer.unsubscribe()
    this.mediaRecorder.pause();
    this.confirmationService.confirm({
      message: this.cancelText,
      accept: () => {
        this.router.navigate(['/setup']);
      },
      reject: () => {
        this.mediaRecorder.resume();
        setTimeout(() => {
          this.stopwatch()
        }, 2000);
      }
    });
  }

  ngOnDestroy(){
    (<any>window).stream.getTracks()[0].stop()
    setTimeout(() => {
      this.videoTimer.unsubscribe()
    }, 4000);
  }
}
