import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { fadeAnimation } from '../../shared/app.animation';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
  animations: [fadeAnimation],
})
export class SetupComponent implements OnInit, AfterViewInit , OnDestroy{
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

    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
      devices.forEach(function(device) {
    
        if(device.kind === 'videoinput'){
          tempThis.camera.push({label : device.label, Id: device.deviceId})
          tempThis.deviceID = device.deviceId
        }
      });
    })

    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {     
      navigator.mediaDevices.getUserMedia({ video:{deviceId: tempThis.cameraDeviceId ? {exact: tempThis.cameraDeviceId} : undefined}})
      .then(stream => {
        (<any>window).stream = stream;
        this.videoStream = stream;
        _video.srcObject = stream;
        _video.onloadedmetadata = function (e: any) { };
        _video.play();
      })
    }
  }

  ngAfterViewInit() {}
  
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
    this.videoStream =null
  }
}
