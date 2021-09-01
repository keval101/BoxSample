import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SetupService } from '../setup/setup.service';
import { TakescreenshotService } from './takescreenshot.service';

@Component({
  selector: 'app-takescreenshot',
  templateUrl: './takescreenshot.component.html',
  styleUrls: ['./takescreenshot.component.scss']
})
export class TakescreenshotComponent implements OnInit,OnDestroy{
  recording: boolean;
  takeScreenshot: boolean = false;
  onCameraClick : boolean = false;
  imageCapture:boolean = false
  isTaken:boolean = false
  videoStream:any;
  deviceInfoId:any
  @ViewChild('video') video:ElementRef; 
  @ViewChild('canvas') canvas: ElementRef;

  constructor(
    private router: Router,
    public TranslateService: TranslateService,
    private takescreenshotService: TakescreenshotService,
    private setupSerice:SetupService,
  ) {
    this.deviceInfoId = this.setupSerice.cameraIdInformation
  }

  ngOnInit(): void {
    this.recording = true;
    this.takeScreenshot = true
  }

  ngAfterViewInit() {
    let _video = this.video.nativeElement;
    let tempThis = this
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({video: {deviceId: tempThis.deviceInfoId ? {exact: tempThis.deviceInfoId} : undefined}})
      .then(stream => {
        (<any>window).stream = stream;
        this.videoStream= stream;
        _video.srcObject = stream;
        _video.play();
      })
    }
  }

  takeScreenShot(){
   this.isTaken= true
   this.onCameraClick = true
   this.takeScreenshot = false
   this.imageCapture = true
   var context = this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, 640, 480);
  }

  onRetake(){
   this.takeScreenshot = true
   this.onCameraClick = false
   this.imageCapture = false
   this.isTaken= false
  }

  onDone(){
    this.router.navigate(['/choosescreenshot']);
    this.takescreenshotService.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
    this.takescreenshotService.resultImageSource = this.canvas.nativeElement.toDataURL("image/png");
  }

  ngOnDestroy(){
    if ((<any>window).stream) {
      (<any>window).stream.getTracks().forEach(track => {
        track.stop();
      });
  }
  }

}
