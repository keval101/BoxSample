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
import { HeaderService } from 'src/app/features/header/header.service';
import { fadeAnimation } from 'src/app/shared/app.animation';
import { UtilityService } from 'src/app/shared/shared/utility.service';
import { EvolutionService } from '../evaluation/evolution.service';
import { TakescreenshotService } from '../takescreenshot/takescreenshot.service';
import { SelfAssesmentService } from './self-assesment.service';

@Component({
  selector: 'app-self-assesment',
  templateUrl: './self-assesment.component.html',
  styleUrls: ['./self-assesment.component.scss'],
  animations: [fadeAnimation],
})
export class SelfAssesmentComponent implements OnInit {
  recording: boolean;
  isScreenShot: boolean;
  items = [];
  responsiveOptions;
  resultImage;
  touchScreen: boolean;
  imagePreviews;
  sidebarOpen = false;
  sidebarOpenText = false;
  cancelText: string;
  pageIndex: number;
  itemImage = '';

  @ViewChild('sidenav') sidenav: ElementRef;

  constructor(
    private router: Router,
    public translateService: TranslateService,
    private takescreenshotService: TakescreenshotService,
    private confirmationService: ConfirmationService,
    private selfAssesmentService: SelfAssesmentService,
    private headerService: HeaderService,
    private evolutionService: EvolutionService,
    public utility: UtilityService
  ) {
    if (window.matchMedia('(pointer: coarse)').matches) {
      this.touchScreen = true;

      setTimeout(() => {
        this.imagePreviews = document.getElementsByClassName('p');
        this.imagePreviews[0].classList.add();
        const btnNext = document.querySelector('.p-carousel-next');
        const btnPrev = document.querySelector('.p-carousel-prev');
        btnNext.classList.add('leval');
        btnPrev.classList.add('leval');
        // this.imagePreviews[this.pageIndex].className += " active";
      }, 1);
    } else {
      this.touchScreen = false;
    }

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
    this.itemImage = '';
    this.pageIndex = indexOf.page;
    this.selfAssesmentService.imageIndex = this.pageIndex;
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

  onSlidebarOpen(value: boolean): void {
    this.sidebarOpen = value;
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

  confirm(): void {
    this.confirmationService.confirm({
      message: this.cancelText,
      accept: () => {
        this.evolutionService.cancelValue = true;
        this.router.navigate(['/end']);
      },
    });
  }

  ngOnInit(): void {
    this.translateService
      .get('selfassesment.cancelText')
      .subscribe((text: string) => {
        this.cancelText = text;
      });

    // this.imagePreviews[0].classList.add('active')
    this.isScreenShot = true;
    this.recording = true;
    this.items = [
      { img: '../../../assets/images/screenshot0.png' },
      { img: '../../../assets/images/screenshot1.png' },
      { img: '../../../assets/images/screenshot2.png' },
      { img: '../../../assets/images/screenshot3.png' },
    ];
    this.resultImage = this.takescreenshotService.resultImageSource;
  }
  active(item: { img }, ids: number): void {
    this.itemImage = '';
    for (let i = 0; i < this.imagePreviews.length; i++) {
      this.imagePreviews[i].classList.remove('active');
      this.itemImage = item.img;
      this.imagePreviews[ids].classList.add('active');
    }
  }

  slibar(): void {
    this.sidebarOpen = true;
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
    this.router.navigate(['/self-assesment-questions']);
  }
}
