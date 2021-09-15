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

@Component({
  selector: 'app-selfassesment-questions',
  templateUrl: './selfassesment-questions.component.html',
  styleUrls: ['./selfassesment-questions.component.scss'],
  animations: [fadeAnimation],
})
export class SelfassesmentQuestionsComponent implements OnInit {
  recording: boolean;
  isScreenShot: boolean;
  answer1 = 'Yes';
  answer2;
  answer3;
  sidebarOpen: boolean;

  cancelText: string;

  @ViewChild('sidenav') sidenav: ElementRef;

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    public translateService: TranslateService
  ) {}

  @HostListener('document:click', ['$event'])
  clickout(event: Event): void {
    if (
      this.sidebarOpen &&
      !this.sidenav.nativeElement.contains(event.target)
    ) {
      this.sidebarOpen = false;
    }
  }

  ngOnInit(): void {
    this.translateService.get('selfassesmentquestions.cancelText').subscribe(
      (text: string) => {
        this.cancelText = text;
      }
    );
    this.isScreenShot = true;
    this.recording = true;
  }

  slibar(): void {
    this.sidebarOpen = true;
  }
  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  redirectTo(): void {
    this.router.navigate(['/evaluation']);
  }

  onCancelExersice(): void {
    this.confirmationService.confirm({
      message: this.cancelText,
      accept: () => {
        this.router.navigate(['/end']);
      },
    });
  }

  confirm(): void {
    this.confirmationService.confirm({
      message: this.cancelText,
      accept: () => {
        this.router.navigate(['/end']);
      },
    });
  }
}
