import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { HeaderService } from 'src/app/features/header/header.service';
import { fadeAnimation } from 'src/app/shared/app.animation';
import { DataService } from 'src/app/shared/shared/data.service';
import { UtilityService } from 'src/app/shared/shared/utility.service';
import { EvolutionService } from '../evaluation/evolution.service';
import { TakescreenshotService } from '../takescreenshot/takescreenshot.service';
import { SelfAssesmentService } from './self-assesment.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-self-assesment',
  templateUrl: './self-assesment.component.html',
  styleUrls: ['./self-assesment.component.scss'],
  animations: [fadeAnimation],
})
export class SelfAssesmentComponent implements OnInit, OnDestroy {
  recording: boolean;
  isScreenShot: boolean;
  responsiveOptions;
  resultImage;
  touchScreen: boolean;
  imagePreviews;
  sidebarOpen = false;
  sidebarOpenText = false;
  cancelText: string;
  pageIndex: number;
  selectedPage = 0;
  screenShots;
  selectedScreenShot: string;
  totalScreenShot = [];
  indexDB;
  indexDbSubscription: Subscription;
  display = false;
  popupImageUrl: any;
  myStyle: SafeHtml;

  @ViewChild('sidenav') sidenav: ElementRef;

  constructor(
    private router: Router,
    public translateService: TranslateService,
    private takescreenshotService: TakescreenshotService,
    private confirmationService: ConfirmationService,
    private selfAssesmentService: SelfAssesmentService,
    private headerService: HeaderService,
    private evolutionService: EvolutionService,
    private sanitizer: DomSanitizer,
    public utility: UtilityService,
    private dataService: DataService,
    private _sanitizer: DomSanitizer
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3,
        effect: 'fade',
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2,
        effect: 'fade',
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1,
        effect: 'fade',
      },
    ];
  }

  setPage(indexOf: { page: number }): void {
    this.pageIndex = indexOf.page;
    this.screenShots.forEach((element, index) => {
      if (index === this.pageIndex) {
        this.selfAssesmentService.imageIndex = element;
        this.selectedScreenShot = element;
      }
    });

    for (let i = 0; i < this.imagePreviews.length; i++) {
      this.imagePreviews[i].className = this.imagePreviews[i].className.replace(
        ' active',
        ''
      );
    }
    this.imagePreviews[this.pageIndex].className += ' active';
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event): void {
    if (
      (this.sidebarOpen || this.sidebarOpenText) &&
      !this.sidenav.nativeElement.contains(event.target)
    ) {
      this.sidebarOpen = false;
      this.sidebarOpenText = false;
      this.headerService.isInfoOpen = false;
    }
  }

  get appData() {
    return this.dataService.appData;
  }

  get branding() {
    return this.dataService.branding;
  }

  onSlidebarOpen(value: boolean): void {
    this.sidebarOpen = value;
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

  confirm(): void {
    this.confirmationService.confirm({
      message: this.cancelText,
      accept: () => {
        this.evolutionService.setCancelValue(true);
        this.router.navigate(['/end']);
      },
    });
  }

  ngOnInit(): void {
    this.myStyle = this._sanitizer.bypassSecurityTrustHtml(
      `<style>
      #sidebar__content h1 {font-size: ${this.branding.generalConfig.contentTitle.fontSize} !important;color: ${this.branding.generalConfig.contentTitle.color};font-weight: ${this.branding.generalConfig.contentTitle.fontWeight};font-family: ${this.branding.generalConfig.contentTitle.fontFamily};}
      #sidebar__content h2 {font-size: ${this.branding.generalConfig.contentTextTitle.fontSize};color: ${this.branding.generalConfig.contentTextTitle.color};font-weight: ${this.branding.generalConfig.contentTextTitle.fontWeight};font-family: ${this.branding.generalConfig.contentTextTitle.fontFamily};}
      #sidebar__content p {font-size: ${this.branding.generalConfig.contentText.fontSize} ;color: ${this.branding.generalConfig.contentText.color} ;font-weight: ${this.branding.generalConfig.contentText.fontWeight};font-family: ${this.branding.generalConfig.contentText.fontFamily};}
      #sidebar__content ul{font-size: ${this.branding.generalConfig.contentText.fontSize} ;color: ${this.branding.generalConfig.contentText.color} ;font-weight: ${this.branding.generalConfig.contentText.fontWeight};font-family: ${this.branding.generalConfig.contentText.fontFamily};}
      .p-dialog.p-confirm-dialog .p-confirm-dialog-message{font-size: ${this.branding.generalConfig.contentText.fontSize} !important;color: ${this.branding.generalConfig.contentText.color};font-weight: ${this.branding.generalConfig.contentText.fontWeight};font-family: ${this.branding.generalConfig.contentText.fontFamily};}
      .p-carousel .p-carousel-content .p-carousel-prev {background: ${this.branding.generalConfig.secondaryColor} !important; }
      .p-carousel .p-carousel-content .p-carousel-next {background: ${this.branding.generalConfig.secondaryColor} !important; }
      .pi-chevron-right:before {color: ${this.branding.generalConfig.primaryColor} !important; }
      .pi-chevron-left:before {color: ${this.branding.generalConfig.primaryColor} !important; }
      </style>`
    );
    this.translateService
      .get('selfassesment.cancelText')
      .subscribe((text: string) => {
        this.cancelText = text;
      });
    this.isScreenShot = true;
    this.recording = true;
    if (this.appData) {
      this.screenShots = this.appData.questionnaire.pages[0].screenshots;
    }

    this.resultImage = this.sanitizer.bypassSecurityTrustResourceUrl(
      URL.createObjectURL(this.takescreenshotService.captures)
    );

    this.setScreenShots();
  }

  ngOnDestroy() {
    if (this.indexDbSubscription) {
      this.indexDbSubscription.unsubscribe();
    }
  }

  active(index: number): void {
    for (let i = 0; i < this.imagePreviews.length; i++) {
      this.imagePreviews[i].classList.remove('active');
    }
    this.imagePreviews[index].classList.add('active');
    this.selectedPage = index;
  }

  slibar(): void {
    this.sidebarOpen = true;
  }

  setScreenShots() {
    if (window.matchMedia('(pointer: coarse)').matches) {
      this.touchScreen = true;
      setTimeout(() => {
        this.imagePreviews = document.getElementsByClassName('p');
        this.selfAssesmentService.imageIndex = this.totalScreenShot[0];
        setTimeout(() => {
          this.imagePreviews[0].classList.add('active');
        }, 100);
        const btnNext = document.querySelector('.p-carousel-next');
        const btnPrev = document.querySelector('.p-carousel-prev');
        if (btnNext && btnPrev) {
          btnNext.classList.add('leval');
          btnPrev.classList.add('leval');
        }
      }, 1);
    } else {
      this.touchScreen = false;
      setTimeout(() => {
        this.imagePreviews = document.getElementsByClassName('p');
        this.selfAssesmentService.imageIndex = this.screenShots[0];
        setTimeout(() => {
          this.imagePreviews[0].classList.add('active');
        }, 100);
      }, 1);
    }
  }

  sidebarOpenData(event: Event): void {
    event.stopPropagation();
    this.sidebarOpenText = true;
  }
  closeSidebar(): void {
    this.sidebarOpenText = false;
    this.sidebarOpen = false;
    this.headerService.isInfoOpen = false;
  }
  redirectTo(): void {
    if (!this.selectedScreenShot) {
      this.selectedScreenShot = this.screenShots[0];
      this.dataService.selfAssessmentScreenShot = this.screenShots[0];
    }
    this.dataService.selfAssessmentScreenShot = this.selectedScreenShot;
    this.dataService.preserveQueryParams('/self-assesment-questions');
  }

  showDialog(url) {
    this.display = true;
    this.popupImageUrl = url;
  }
}
