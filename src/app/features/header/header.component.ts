import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  checked: boolean = true;
  @Input() onFinishRecording: boolean;
  @Input() onScreenShot: boolean;

  constructor() {}

  ngOnInit(): void {}
}
