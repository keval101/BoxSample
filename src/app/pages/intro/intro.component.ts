import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  sidebar = true;
  cancelText: string;
  introScreen = true;
  mobile = false;
  @ViewChild('sidenav') sidenav: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    const w = event.target as Window;
    const width = w.innerWidth;
    if (width <= 600) {
      this.mobile = false;
      this.sidebar = false;
    } else {
      this.sidebar = true;
      this.mobile = true;
    }
  }
  constructor(
    public translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private evolutionService: EvolutionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recording = true;

    this.translateService.get('intro.cancelText').subscribe((text: string) => {
      this.cancelText = text;
    });
    if (window.innerWidth > 600) {
      this.sidebar = true;
      this.mobile = true;
    } else {
      this.sidebar = false;
      this.mobile = false;
    }
    this.checkDeviceWidth(window.innerWidth);
  }

  checkDeviceWidth(width: number): void {
    if (width <= 600) {
      this.mobile = false;
      this.sidebar = false;
    } else {
      this.sidebar = true;
      this.mobile = true;
    }
  }

  showDetail(): void {
    this.sidebar = !this.sidebar;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event): void {
    if (window.innerWidth < 600) {
      if (this.sidebar && !this.sidenav.nativeElement.contains(event.target)) {
        this.sidebar = false;
      }
    }
  }

  redirectTo(): void {
    this.router.navigate(['/video']);
  }

  closeSidebar(): void {
    if (window.innerWidth < 600) {
      this.sidebar = false;
    }
  }
  confirm(): void {
    this.confirmationService.confirm({
      message: this.cancelText,
      accept: () => {
        this.evolutionService.cancelValue = true;
        this.router.navigate(['/end']);
      },
    });
  }

  onCancelExersice(): void {
    this.confirmationService.confirm({
      message: this.cancelText,
      accept: () => {
        this.evolutionService.cancelValue = true;
        this.router.navigate(['/end']);
      },
    });
  }
}
