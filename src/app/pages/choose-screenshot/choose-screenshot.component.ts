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
import { DataService } from 'src/app/shared/shared/data.service';
import { EvolutionService } from '../evaluation/evolution.service';
import { TakescreenshotService } from '../takescreenshot/takescreenshot.service';
@Component({
  selector: 'app-choose-screenshot',
  templateUrl: './choose-screenshot.component.html',
  styleUrls: ['./choose-screenshot.component.scss'],
  animations: [fadeAnimation],
})
export class ChooseScreenshotComponent implements OnInit {
  items = [];
  recording = false;
  responsiveOptions;
  cancelText: string;

  isSidebarOpen = false;

  @ViewChild('sidenav') sidenav: ElementRef;

  constructor(
    public translateService: TranslateService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private takescreenshotService: TakescreenshotService,
    private headerService: HeaderService,
    private dataservice: DataService,
    private evolutionService: EvolutionService
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
  clickout(event: Event): void {
    if (
      this.isSidebarOpen &&
      !this.sidenav.nativeElement.contains(event.target)
    ) {
      this.isSidebarOpen = false;
      this.headerService.isInfoOpen = false;
    }
  }

  ngOnInit(): void {
    this.translateService
      .get('chooseScreenshot.cancelText')
      .subscribe((text: string) => {
        this.cancelText = text;
      });
    this.recording = true;
    this.items = this.takescreenshotService.captures;
  }

  backToScreenShot(): void {
    this.takescreenshotService.captures.pop();
    this.router.navigate(['/takescreenshot']);
  }

  onSlidebarOpen(value: boolean): void {
    this.isSidebarOpen = value;
  }

  onSlidebarClose(): void {
    this.isSidebarOpen = false;
    this.headerService.isInfoOpen = false;
  }

  redirectTo(): void {
    this.router.navigate(['/self-assesment']);
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

  get appData() {
    return this.dataservice.appData;
  }
}
