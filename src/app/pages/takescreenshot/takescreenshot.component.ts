import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ChoosescreenshotService } from '../choose-screenshot/choosescreenshot.service';
import { TakescreenshotService } from './takescreenshot.service';

@Component({
  selector: 'app-takescreenshot',
  templateUrl: './takescreenshot.component.html',
  styleUrls: ['./takescreenshot.component.scss']
})
export class TakescreenshotComponent implements OnInit{
  recording: boolean;
  isScreenShot: boolean;
  takeScreenshot: boolean = false;
  onCameraClick : boolean = false;
  imageCapture:boolean = false

  constructor(
    private router: Router,
    public TranslateService: TranslateService,
    private choosescreenshotService:ChoosescreenshotService,
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
  }


  takeScreenShot(){
   this.onCameraClick = true
   this.takeScreenshot = false
   this.imageCapture = true
  }

  onRetake(){
   this.takeScreenshot = true
   this.onCameraClick = false
   this.imageCapture = false
  }

  onDone(){
    this.router.navigate(['/choosescreenshot']);
  }
}
