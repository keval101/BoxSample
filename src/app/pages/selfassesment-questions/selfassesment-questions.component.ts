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

@Component({
  selector: 'app-selfassesment-questions',
  templateUrl: './selfassesment-questions.component.html',
  styleUrls: ['./selfassesment-questions.component.scss'],
  animations: [fadeAnimation],
})
export class SelfassesmentQuestionsComponent implements OnInit {
  recording: boolean;
  isScreenShot: boolean;
  answer1;
  answer2;
  answer3;
  sidebarOpen: boolean;
  sidebarOpenText = false;
  cancelText: string;
  disabled = true;
  radioData;

  @ViewChild('sidenav') sidenav: ElementRef;

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    public translateService: TranslateService,
    private headerService: HeaderService,
    private evolutionService: EvolutionService,
    private dataService: DataService
  ) {}

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

  ngOnInit(): void {
    this.translateService
      .get('selfassesmentquestions.cancelText')
      .subscribe((text: string) => {
        this.cancelText = text;
      });
    this.isScreenShot = true;
    this.recording = true;
    this.radioData = this.appData.questionnaire.pages[1].sections[0].questions;

    this.radioData.forEach((element) => {
      element.answers.forEach((elementAns) => {
        if (elementAns.name === 'Yes' || elementAns.name === 'No') {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
      });
    });
  }

  get appData() {
    return this.dataService.appData;
  }

  slibar(): void {
    this.sidebarOpen = true;
  }
  closeSidebar(): void {
    this.sidebarOpen = false;
    this.headerService.isInfoOpen = false;
  }
  redirectTo(): void {
    this.router.navigate(['/evaluation']);
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

  isDisable() {
    return (
      !this.radioData ||
      (this.radioData &&
        this.radioData.find((x) => x.selectedAnswer === undefined))
    );
  }

  sidebarOpenData(event: Event): void {
    event.stopPropagation();
    this.sidebarOpenText = true;
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
}
