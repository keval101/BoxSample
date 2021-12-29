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
import { SelfAssesmentQuestionService } from './self-assesment-questions.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from 'src/environments';

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
  radioData = [];
  radioDatas = [];
  myStyle: SafeHtml;

  brand = environment.branding;

  @ViewChild('sidenav') sidenav: ElementRef;

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    public translateService: TranslateService,
    private headerService: HeaderService,
    private evolutionService: EvolutionService,
    private dataService: DataService,
    private selfAssesQueSer: SelfAssesmentQuestionService,
    private _sanitizer: DomSanitizer
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
    this.myStyle = this._sanitizer.bypassSecurityTrustHtml(
      `<style>
      #sidebar__content h1 {font-size: ${this.branding.generalConfig.sidebarTitle.fontSize} !important;color: ${this.branding.generalConfig.sidebarTitle.color};font-weight: ${this.branding.generalConfig.sidebarTitle.fontWeight};font-family: ${this.branding.generalConfig.sidebarTitle.fontFamily};}
      #sidebar__content h2 {font-size: ${this.branding.generalConfig.contentTextTitle.fontSize};color: ${this.branding.generalConfig.contentTextTitle.color};font-weight: ${this.branding.generalConfig.contentTextTitle.fontWeight};font-family: ${this.branding.generalConfig.contentTextTitle.fontFamily};}
      #sidebar__content p {font-size: ${this.branding.generalConfig.contentText.fontSize} ;color: ${this.branding.generalConfig.contentText.color} ;font-weight: ${this.branding.generalConfig.contentText.fontWeight};font-family: ${this.branding.generalConfig.contentText.fontFamily};}
      #sidebar__content ul{font-size: ${this.branding.generalConfig.contentText.fontSize} ;color: ${this.branding.generalConfig.contentText.color} ;font-weight: ${this.branding.generalConfig.contentText.fontWeight};font-family: ${this.branding.generalConfig.contentText.fontFamily};}
      .p-dialog.p-confirm-dialog .p-confirm-dialog-message{font-size: ${this.branding.generalConfig.contentText.fontSize} !important;color: ${this.branding.generalConfig.contentText.color};font-weight: ${this.branding.generalConfig.contentText.fontWeight};font-family: ${this.branding.generalConfig.contentText.fontFamily};}
      .p-radiobutton .p-radiobutton-box .p-radiobutton-icon {background: ${this.branding.generalConfig.UIElementRadio} !important; }</style>`
    );

    this.translateService
      .get('selfassesmentquestions.cancelText')
      .subscribe((text: string) => {
        this.cancelText = text;
      });
    this.isScreenShot = true;
    this.recording = true;
    if (this.appData) {
      this.radioData =
        this.appData.questionnaire.pages[1].sections[0].questions;
    }

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

  get branding() {
    return this.dataService.branding;
  }

  handleChange(e, data, ans) {
    if (this.radioDatas.length > 0) {
      const idx = this.radioDatas.findIndex((idxs) => idxs.name === data.name);
      if (idx !== -1) {
        this.radioDatas[idx].score = ans.score;
        this.radioDatas[idx].hint = ans.hint;
      } else {
        this.radioDatas.push({
          name: data.name,
          score: ans.score,
          hint: ans.hint,
          selectedAns: data.selectedAnswer,
          optionName: ans.name,
        });
      }
    } else {
      this.radioDatas.push({
        name: data.name,
        score: ans.score,
        hint: ans.hint,
        selectedAns: data.selectedAnswer,
        optionName: ans.name,
      });
    }
  }

  slibar(): void {
    this.sidebarOpen = true;
  }
  closeSidebar(): void {
    this.sidebarOpen = false;
    this.headerService.isInfoOpen = false;
  }
  redirectTo(): void {
    this.selfAssesQueSer.screenShotData = this.radioDatas;
    this.dataService.preserveQueryParams('/evaluation');
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
        this.evolutionService.setCancelValue(true);
        this.router.navigate(['/end']);
      },
    });
  }
}
