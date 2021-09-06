import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { fadeAnimation } from '../../shared/app.animation';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  animations: [fadeAnimation],
})
export class IntroComponent implements OnInit {
  recording: boolean;
  sidebar: boolean = true;
  constructor(
    public TranslateService: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recording = true;

    if (window.innerWidth > 600) {
      this.sidebar = true;
    } else {
      this.sidebar = false;
    }
    this.onResize(window.innerWidth);
  }

  onResize(event) {
    let width = event;

    if (width <= 600) {
      this.sidebar = false;
    } else {
      this.sidebar = true;
    }
  }

  showDetail() {
    this.sidebar = !this.sidebar;
  }

  redirectTo() {
    this.router.navigate(['/video']);
  }

  closeSidebar() {
    if (window.innerWidth < 600) {
      this.sidebar = false;
    }
  }
}
