import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ChoosescreenshotService } from '../choose-screenshot/choosescreenshot.service';
import { TakescreenshotService } from './takescreenshot.service';

@Component({
  selector: 'app-takescreenshot',
  templateUrl: './takescreenshot.component.html',
  styleUrls: ['./takescreenshot.component.scss']
})
export class TakescreenshotComponent implements OnInit,OnDestroy{
  recording: boolean;
  isScreenShot: boolean;
  takeScreenshot: boolean = false;
  onCameraClick : boolean = false;
  imageCapture:boolean = false
  isTaken:boolean = false
  videoStream:any;
  
  @ViewChild('video') video:ElementRef; 
  @ViewChild('canvas') canvas: ElementRef;

  constructor(
    private router: Router,
    public TranslateService: TranslateService,
    private choosescreenshotService:ChoosescreenshotService,
    private takescreenshotService: TakescreenshotService
  ) {}

  ngOnInit(): void {
    this.isScreenShot = true;
    this.recording = true;
    this.takeScreenshot = true

    if(this.choosescreenshotService.backToScreen == true){
      this.takeScreenshot = true;
      this.recording = true;
      this.isScreenShot = true;
    }
   this.takescreenshotService.captures = []
  }

  ngAfterViewInit() {
    let _video = this.video.nativeElement;

    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        (<any>window).stream = stream;
        this.videoStream= stream;
        _video.srcObject = stream;
        _video.play();
      })
    }
  }

  takeScreenShot(){
   this.onCameraClick = true
   this.takeScreenshot = false
   this.imageCapture = true
   var context = this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, 640, 480);
   this.takescreenshotService.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
  }

  onRetake(){
   this.takescreenshotService.captures = []
   this.takeScreenshot = true
   this.onCameraClick = false
   this.imageCapture = false
  }

  onDone(){
    this.router.navigate(['/choosescreenshot']);
  }

  ngOnDestroy(){
    if ((<any>window).stream) {
      (<any>window).stream.getTracks().forEach(track => {
        track.stop();
      });
  }
  }

}
