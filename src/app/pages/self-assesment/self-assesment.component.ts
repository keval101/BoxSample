import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { fadeAnimation } from 'src/app/shared/app.animation';
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
  items: any[] = [];
  responsiveOptions: any;
  resultImage: any;
  touchScreen: boolean;
  imagePreviews: any;
  sidebarOpen: boolean;
  cancelText:string;

  itemImage = '';

  @ViewChild('sidenav') sidenav: ElementRef;

  constructor(
    private router: Router,
    public TranslateService: TranslateService,
    private takescreenshotService: TakescreenshotService,
    private confirmationService: ConfirmationService,
    private selfAssesmentService: SelfAssesmentService
  ) {
    if (window.matchMedia('(pointer: coarse)').matches) {
      this.touchScreen = true;

      setTimeout(() => {
        
        this.imagePreviews = document.getElementsByClassName('p');
        this.imagePreviews[0].classList.add();
        var btnNext = document.querySelector('.p-carousel-next');
        var btnPrev = document.querySelector('.p-carousel-prev');
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
        effect : 'fade'
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2,
        effect : 'fade'
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1,
        effect : 'fade'
      },
    ];
  }


  pageIndex: any;
  setPage(indexOf) {
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
  clickout(event) {
    if (this.sidebarOpen && !this.sidenav.nativeElement.contains(event.target)) {
      this.sidebarOpen = false;
    }
  }

  onSlidebarOpen(value) {
    this.sidebarOpen = value;
  }

  onCancelExersice() {   
    this.confirmationService.confirm({
      message: this.cancelText,
      accept: () => {
        this.router.navigate(['/end']);
      },
    });
  }


  ngOnInit(): void {

    this.TranslateService.get('selfassesment.cancelText').subscribe((text: string) => {
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
    let array = this.takescreenshotService.captures;
    this.resultImage = this.takescreenshotService.resultImageSource;
  }
  active(item,ids){
    this.itemImage = '';
    for (let i = 0; i < this.imagePreviews.length; i++) {
      this.imagePreviews[i].classList.remove('active')
    }
    if(this.pageIndex){
      this.itemImage = item.img
      for (let i = 0; i <= this.imagePreviews.length; i++) {
        this.imagePreviews[ids].classList.add('active')
      }
    }
  }

  slibar() {
    this.sidebarOpen = true;
  }
  closeSidebar() {
    this.sidebarOpen = false;
  }
  redirectTo() {
    this.router.navigate(['/self-assesment-questions']);
  }
}
