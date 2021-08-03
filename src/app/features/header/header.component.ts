import { Component, Input, Output, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() onFinishRecording: boolean;
  @Input() onScreenShot: boolean;
  @Input() sidebarOpen: boolean;
  @Input() ontakeScreenshot:boolean;
  @Output() show = new Subject()

  checkedMic: boolean = true;
  checkedFlash: boolean = false;
  showSide: boolean = true
  fullScreen:boolean = false;
  constructor(public translate: TranslateService) {}

  ngOnInit(): void {}

  onShow(){
    // this.show.next(this.showSide)
  }

  fullscreen(){
    this.fullScreen = true;
  }

  closescreen(){
    this.fullScreen =  false;
  }
}
