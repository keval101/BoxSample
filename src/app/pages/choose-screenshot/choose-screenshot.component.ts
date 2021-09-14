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
import { fadeAnimation } from 'src/app/shared/app.animation';
import { TakescreenshotService } from '../takescreenshot/takescreenshot.service';
@Component({
  selector: 'app-choose-screenshot',
  templateUrl: './choose-screenshot.component.html',
  styleUrls: ['./choose-screenshot.component.scss'],
  animations: [fadeAnimation],
})
export class ChooseScreenshotComponent implements OnInit {
  items: any[] = [];
  recording: boolean = false;
  responsiveOptions: any;
  cancelText: string;

  isSidebarOpen: boolean = false;

  @ViewChild('sidenav') sidenav: ElementRef;

  constructor(
    public TranslateService: TranslateService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private takescreenshotService: TakescreenshotService
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 1,
        numScroll: 3,
      },
      {
        breakpoint: '768px',
        numVisible: 1,
        numScroll: 2,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (
      this.isSidebarOpen &&
      !this.sidenav.nativeElement.contains(event.target)
    ) {
      this.isSidebarOpen = false;
    }
  }

  ngOnInit(): void {
    this.TranslateService.get('chooseScreenshot.cancelText').subscribe(
      (text: string) => {
        this.cancelText = text;
      }
    );
    this.recording = true;
    this.items = this.takescreenshotService.captures;
  }

  backToScreenShot() {
    this.takescreenshotService.captures.pop();
    this.router.navigate(['/takescreenshot']);
  }

  onSlidebarOpen(value) {
    this.isSidebarOpen = value;
  }

  onSlidebarClose() {
    this.isSidebarOpen = false;
  }

  redirectTo() {
    this.router.navigate(['/self-assesment']);
  }
  onCancelExersice() {
    this.confirmationService.confirm({
      message: this.cancelText,
      accept: () => {
        this.router.navigate(['/end']);
      },
    });
  }
  confirm() {
    this.confirmationService.confirm({
      message: this.cancelText,
      accept: () => {
        this.router.navigate(['/end']);
      },
    });
  }
}
