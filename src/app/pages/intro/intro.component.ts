import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { DataService } from 'src/app/shared/shared/data.service';
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
  myStyle: SafeHtml;

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
    private router: Router,
    private dataService: DataService,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.myStyle = this._sanitizer.bypassSecurityTrustHtml(
      `<style>#sidebar__content h2 {font-size: ${this.branding.generalConfig.contentTextTitle.fontSize};color: ${this.branding.generalConfig.contentTextTitle.color};font-weight: ${this.branding.generalConfig.contentTextTitle.fontWeight};font-family: ${this.branding.generalConfig.contentTextTitle.fontFamily};}
      #sidebar__content p {font-size: ${this.branding.generalConfig.contentText.fontSize};color: ${this.branding.generalConfig.contentText.color};font-weight: ${this.branding.generalConfig.contentText.fontWeight};font-family: ${this.branding.generalConfig.contentText.fontFamily};}
      #sidebar__content ul{font-size: ${this.branding.generalConfig.contentText.fontSize};color: ${this.branding.generalConfig.contentText.color};font-weight: ${this.branding.generalConfig.contentText.fontWeight};font-family: ${this.branding.generalConfig.contentText.fontFamily};}
      .p-dialog.p-confirm-dialog .p-confirm-dialog-message{font-size: ${this.branding.generalConfig.contentText.fontSize};color: ${this.branding.generalConfig.contentText.color};font-weight: ${this.branding.generalConfig.contentText.fontWeight};font-family: ${this.branding.generalConfig.contentText.fontFamily};}
      </style>`
    );

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

  get appData() {
    return this.dataService.appData;
  }

  get branding() {
    return this.dataService.branding;
  }

  redirectTo(): void {
    this.dataService.preserveQueryParams('/video');
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
        this.evolutionService.setCancelValue(true);
        this.router.navigate(['/end']);
      },
    });
  }

  onCancelExersice(): void {
    this.confirmationService.confirm({
      message: this.cancelText,
      accept: () => {
        this.evolutionService.setCancelValue(true);
        this.router.navigate(['/end']);
      },
    });
  }
}
