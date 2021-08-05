import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { fadeAnimation } from '../../shared/app.animation';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
  animations: [fadeAnimation],
})
export class SetupComponent implements OnInit {
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

  showDetail() {
    this.sidebar = !this.sidebar;
  }

  onResize(event) {
    console.log(event);
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
    this.router.navigate(['/intro']);
  }
}
