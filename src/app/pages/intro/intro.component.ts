import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { fadeAnimation } from '../../shared/app.animation';
import { EvolutionService } from '../evaluation/evolution.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  animations: [fadeAnimation],
})
export class IntroComponent implements OnInit {
  recording: boolean;
  sidebar: boolean = true;
  cancelText: string;
  introScreen: boolean = true;
  mobile: boolean = false;
  @ViewChild('sidenav') sidenav: ElementRef;
  constructor(
    public TranslateService: TranslateService,
    private confirmationService: ConfirmationService,
    private evolutionService: EvolutionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recording = true;

    this.TranslateService.get('intro.cancelText').subscribe((text: string) => {
      this.cancelText = text;
    });
    if (window.innerWidth > 600) {
      this.sidebar = true;
      this.mobile = true
    } else {
      this.sidebar = false;
      this.mobile = false;
    }
    this.onResize(window.innerWidth);
  }

  onResize(event) {
    let width = event;

    if (width <= 600) {
      this.mobile = false;
      this.sidebar = false;
    } else {
      this.sidebar = true;
      this.mobile = true
    }
  }

  showDetail() {
    this.sidebar = !this.sidebar;
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (window.innerWidth < 600) {
      if (this.sidebar && !this.sidenav.nativeElement.contains(event.target)) {
        this.sidebar = false;
      }
    }
  }

  redirectTo() {
    this.router.navigate(['/video']);
  }

  closeSidebar() {
    if (window.innerWidth < 600) {
      this.sidebar = false;
    }
  }
  confirm() {
    this.confirmationService.confirm({
      message: this.cancelText,
      accept: () => {
        this.evolutionService.cancelValue = true;
        this.router.navigate(['/end']);
      },
    });
  }

  onCancelExersice() {
    this.confirmationService.confirm({
      message: this.cancelText,
      accept: () => {
        this.router.navigate(['/end']);
      },
    });
  }
}
