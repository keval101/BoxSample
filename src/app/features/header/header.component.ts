import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() onFinishRecording: boolean;
  @Input() onScreenShot: boolean;

  checkedMic: boolean = true;
  checkedFlash: boolean = false;

  constructor(public translate: TranslateService) {}

  ngOnInit(): void {}
}
