import {  Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { HeaderService } from 'src/app/features/header/header.service';
import { fadeAnimation } from '../../shared/app.animation';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
  animations: [fadeAnimation],
})
export class SetupComponent implements OnInit, OnDestroy{
  recording: boolean;
  isScreenShot: boolean;
  selectedCamera: string;
  checkedMic: boolean = true;
  checkedFlash: boolean;
  sidebar: boolean;
  deviceID : any;
  cameraDeviceId : any;
  videoStream:any;
  camera:any[] = [];
  @ViewChild('video') video:any; 
  @ViewChild('value') drop:ElementRef; 
  cameraId = new Subject()
  constructor(
    private router: Router,
    public TranslateService: TranslateService,
    private headerService:HeaderService
  ) {}

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
      this.cameraChange()
    }, 500);
  }

  dropValue(event){
    this.cameraDeviceId = event.Id
    this.cameraId.next(event.Id)
  }

  cameraChange(){
    let _video = this.video.nativeElement;
    let tempThis = this

    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio:true ,video:{deviceId: tempThis.cameraDeviceId ? {exact: tempThis.cameraDeviceId} : undefined}})
      .then(stream => {
        _video.volume = 0;
        (<any>window).stream = stream;
        this.videoStream = stream;
        _video.srcObject = stream;
        _video.onloadedmetadata = function (e: any) { };
        _video.play();

        navigator.mediaDevices.enumerateDevices()
      .then(function(devices) {
        devices.forEach(function(device) {
          if(device.kind === 'videoinput'){
            tempThis.camera.push({label : device.label, Id: device.deviceId})
            tempThis.deviceID = device.deviceId
          }
        });
      })
      })
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

  muteUnmuteToggle(){
    this.headerService.muteMic = this.checkedMic
    this.headerService.muteUnmuteMic.next(this.checkedMic)
  }

  redirectTo() {
    this.router.navigate(['/recording']);
  }

  redirectToBack() {
    this.router.navigate(['/video']);
  }

  closeSidebar(){
    if (window.innerWidth < 600) {
      this.sidebar = false;
    } 
  }
  ngOnDestroy(){
    if ((<any>window).stream) {
      (<any>window).stream.getTracks().forEach(track => {
        track.stop();
      });
  }
}
}
