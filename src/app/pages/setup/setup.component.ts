import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { fadeAnimation } from '../../shared/app.animation';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
  animations: [fadeAnimation],
})
export class SetupComponent implements OnInit, AfterViewInit {
  recording: boolean;
  isScreenShot: boolean;
  selectedCamera: string;
  checkedMic: boolean = true;
  checkedFlash: boolean;
  sidebar: boolean;

  camera = [
    { cameraName: 'Internal camera' },
    { cameraName: 'Another camera' },
  ];
  @ViewChild('video') video:any; 

  constructor(
    private router: Router,
    public TranslateService: TranslateService
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
  }
  ngAfterViewInit() {
    let _video = this.video.nativeElement;
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment',}})
      .then(stream => {
        
        (<any>window).stream = stream;
        _video.srcObject = stream;
        _video.onloadedmetadata = function (e: any) { };
        _video.play();
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
}
