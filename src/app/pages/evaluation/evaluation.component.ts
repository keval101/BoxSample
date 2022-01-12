import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { EvolutionService } from './evolution.service';
import { TakescreenshotService } from '../takescreenshot/takescreenshot.service';
import { SelfAssesmentService } from '../self-assesment/self-assesment.service';
import { fadeAnimation } from 'src/app/shared/app.animation';
import { HeaderService } from 'src/app/features/header/header.service';
import { UtilityService } from 'src/app/shared/shared/utility.service';
import { RecordingService } from '../recording-screen/recording.service';
import { DataService } from 'src/app/shared/shared/data.service';
import { SelfAssesmentQuestionService } from '../selfassesment-questions/self-assesment-questions.service';
import { RecordingEnum } from 'src/app/shared/shared/recording.enum';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import * as CryptoJS from 'crypto-js';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from 'src/environments';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
  animations: [fadeAnimation],
})
export class EvaluationComponent implements OnInit, OnDestroy {
  recording: boolean;
  ans = 'Goal';
  val = 0;
  isSidebarOpen = false;
  cancelValue = true;
  resultImage;
  isGoal = true;
  selfAssessImage;
  items = [];
  cancelText: string;
  responsiveOptions = [];
  isDataSave = false;
  @ViewChild('sidenav') sidenav: ElementRef;

  scores = [];

  exerciseData;
  screenshotsData;
  totalScore = 0;
  totalMaxScore = 0;
  allHint = [];
  questionData;
  questionName;
  questionTitle;
  exerciseName;
  indexDB;
  indexDbSubscription: Subscription;
  display = false;
  popupImageUrl: any;
  recordinScore;
  finalObj;
  totalMedia = 0;
  count = 0;
  totalMediaForUpload = [];
  reportGuid: string;
  myStyle: SafeHtml;

  brand = environment.branding;

  constructor(
    private router: Router,
    public translateService: TranslateService,
    private recordingService: RecordingService,
    private evolutionService: EvolutionService,
    private confirmationService: ConfirmationService,
    private takescreenshotService: TakescreenshotService,
    private selfAssesmentService: SelfAssesmentService,
    private headerService: HeaderService,
    public utility: UtilityService,
    private sanitizer: DomSanitizer,
    private dataservice: DataService,
    private selfAssesQueSer: SelfAssesmentQuestionService,
    private activeRoute: ActivatedRoute,
    private _sanitizer: DomSanitizer
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 1,
        numScroll: 3,
        dots: true,
      },
      {
        breakpoint: '768px',
        numVisible: 1,
        numScroll: 2,
        dots: true,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1,
        dots: true,
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
    // .p-rating .p-rating-icon.pi-star
    this.myStyle = this._sanitizer.bypassSecurityTrustHtml(
      `<style>
      #sidebar__content h1 {font-size: ${this.branding.contentTitle.fontSize} !important;color: ${this.branding.contentTitle.color};font-weight: ${this.branding.contentTitle.fontWeight};font-family: ${this.branding.contentTitle.fontFamily};}
      #sidebar__content h2 {font-size: ${this.branding.contentTextTitle.fontSize};color: ${this.branding.contentTextTitle.color};font-weight: ${this.branding.contentTextTitle.fontWeight};font-family: ${this.branding.contentTextTitle.fontFamily};}
      #sidebar__content p {font-size: ${this.branding.contentText.fontSize} ;color: ${this.branding.contentText.color} ;font-weight: ${this.branding.contentText.fontWeight};font-family: ${this.branding.contentText.fontFamily};}
      #sidebar__content ul{font-size: ${this.branding.contentText.fontSize} ;color: ${this.branding.contentText.color} ;font-weight: ${this.branding.contentText.fontWeight};font-family: ${this.branding.contentText.fontFamily};}
      .p-dialog.p-confirm-dialog .p-confirm-dialog-message{font-size: ${this.branding.contentText.fontSize} !important;color: ${this.branding.contentText.color};font-weight: ${this.branding.contentText.fontWeight};font-family: ${this.branding.contentText.fontFamily};}
      .p-carousel .p-carousel-content .p-carousel-prev {background: ${this.branding.UIElementCarouselIndicator.background} !important; }
      .p-carousel .p-carousel-content .p-carousel-next {background: ${this.branding.UIElementCarouselIndicator.background} !important; }
      .pi-chevron-right:before {color: ${this.branding.UIElementCarouselIndicator.color} !important; }
      .pi-chevron-left:before {color: ${this.branding.UIElementCarouselIndicator.color} !important; }
      .p-rating .p-rating-icon.pi-star {color: ${this.branding.UIElementCarouselIndicator.background} !important; }
      .p-rating:not(.p-disabled):not(.p-readonly) .p-rating-icon:hover {color: ${this.branding.UIElementCarouselIndicator.background} !important; }
      .p-carousel .p-carousel-indicators .p-carousel-indicator.p-highlight button {background-color: ${this.branding.UIElementCarouselIndicator.background} !important; }
      </style>`
    );
    const reportGuid = this.activeRoute.snapshot.queryParams['context'];
    this.reportGuid = reportGuid
      ? reportGuid
      : 'f3cefa4a-83c9-473c-8883-3a46f2ff4f2c';
    const newArray = [];
    this.recordingService.sceenShots.forEach((element) => {
      newArray.push(
        this.sanitizer.bypassSecurityTrustResourceUrl(
          URL.createObjectURL(element)
        )
      );
    });
    this.items = [
      this.sanitizer.bypassSecurityTrustResourceUrl(
        URL.createObjectURL(this.takescreenshotService.captures)
      ),
      ...newArray,
    ];

    this.totalMediaForUpload = [
      this.takescreenshotService.captures,
      ...this.recordingService.sceenShots,
    ];

    this.selfAssessImage = this.dataservice.selfAssessmentScreenShot;

    if (this.appData) {
      this.questionData = this.selfAssesQueSer.screenShotData;

      this.questionName = this.appData.questionnaire.pages[1].sections[0];
      this.questionTitle = this.appData.questionnaire.pages[1];
      this.translateService
        .get('evaluation.cancelText')
        .subscribe((text: string) => {
          this.cancelText = text;
        });
      this.exerciseData = this.appData.reportSections[0].reportItems[0];
      this.screenshotsData = this.appData.questionnaire.pages[0];
      this.recording = true;
      this.resultImage = this.appData.takeScreenShot;

      this.questionData.forEach((element) => {
        this.totalScore = this.totalScore + element.score;
        this.allHint.push(element.hint);
      });

      this.questionName.questions.forEach((element) => {
        this.totalMaxScore = this.totalMaxScore + element.maxScore;
      });

      const totalScoreforQue = (this.totalScore * 100) / this.totalMaxScore;
      const totalScoreforScreenShot =
        (this.selfAssessImage.score * 100) / this.screenshotsData.maxScore;
      this.recordinScore = this.recordingTime();
      this.scores = [
        {
          title: this.exerciseData.name,
          measured: this.dataservice.displayTimer,
          goalvalue: this.exerciseData.goalValueString,
          score:
            Math.round(this.recordinScore) + ' / ' + this.exerciseData.maxScore,
        },
        {
          title: this.screenshotsData.name,
          measured: totalScoreforScreenShot.toFixed(0) + '%',
          goalvalue: '100%',
          score:
            this.selfAssessImage.score + ' / ' + this.screenshotsData.maxScore,
        },
        {
          title: this.questionTitle.name,
          measured: totalScoreforQue.toFixed(0) + '%',
          goalvalue: '100%',
          score: this.totalScore + ' / ' + this.totalMaxScore,
        },
      ];
    }
  }

  createReqData() {
    const questions = [];
    const screenshots = [];
    this.questionName.questions.forEach((element, index) => {
      const question = {
        // calculated from Answers
        Score: this.selfAssesQueSer.screenShotData[index].score,
        // calculated from Answers
        MaxScore: element.maxScore,
        MinScore: element.minScore,
        Row: element.row,
        Column: element.column,
        RowSpan: element.rowSpan,
        ColumnSpan: element.columnSpan,
        SelectionMode: element.minScore,
        AnswerMode: element.answerMode,
        Orientation: element.orientation,
        Answers: [
          {
            // "isCorrect" from SceneDetails endpoint response
            IsDefinedAsCorrect: element.answers[0].isCorrect,
            // you will calculate
            IsCorrectlyAnswered:
              this.selfAssesQueSer.screenShotData[index].selectedAns,
            // "score" from SceneDetails endpoint response
            ScoreDefined: element.answers[0].score,
            // "penaltyScore" from SceneDetails endpoint response
            PenaltyScoreDefined: element.answers[0].penaltyScore,
            // you will calculate
            ScoreEvaluated: this.selfAssesQueSer.screenShotData[index].score,
            IsSelected:
              this.selfAssesQueSer.screenShotData[index].optionName === 'Yes'
                ? true
                : false,
            AnswerType: element.answers[0].answerType,
            NameLanguageKey: element.answers[0].nameLanguageKey,
            DescriptionLanguageKey: element.answers[0].descriptionLanguageKey,
            SortId: 0,
            // static
            IsVisible: true,
            Identifier: element.answers[0].identifier,
          },
          {
            // "isCorrect" from SceneDetails endpoint response
            IsDefinedAsCorrect: element.answers[1].isCorrect,
            // you will calculate
            IsCorrectlyAnswered:
              this.selfAssesQueSer.screenShotData[index].selectedAns,
            // "score" from SceneDetails endpoint response
            ScoreDefined: element.answers[1].score,
            // "penaltyScore" from SceneDetails endpoint response
            PenaltyScoreDefined: element.answers[1].penaltyScore,
            // you will calculate
            ScoreEvaluated: this.selfAssesQueSer.screenShotData[index].score,
            IsSelected:
              this.selfAssesQueSer.screenShotData[index].optionName === 'No'
                ? true
                : false,
            AnswerType: element.answers[1].answerType,
            NameLanguageKey: element.answers[1].nameLanguageKey,
            DescriptionLanguageKey: element.answers[1].descriptionLanguageKey,
            SortId: 1,
            // static
            IsVisible: true,
            Identifier: element.answers[1].identifier,
          },
        ],
        NameLanguageKey: element.nameLanguageKey,
        DescriptionLanguageKey: element.descriptionLanguageKey,
        SortId: index,
        IsVisible: true,
        Identifier: element.identifier,
      };
      questions.push(question);
    });

    this.totalMediaForUpload.forEach((element) => {
      const obj = {
        GroupLanguageKey: '',
        DescriptionLanguageKey: 'Measurement screenshot description',
        NameLanguageKey: 'Measurement screenshot name',
        SortId: 0,
        Id: uuidv4(),
        FileName: 'ScreenshotFileName.png',
        FileGeneratedName: null,
      };

      this.dataservice.screenShotsBlob.push({
        id: obj.Id,
        blob: element,
      });
      screenshots.push(obj);
    });

    this.finalObj = {
      // Generate unique
      Id: uuidv4(),
      //data.identifier
      ActualSceneIdentifier: this.appData.identifier,
      //data.identifier
      SceneIdentifier: this.appData.identifier,
      SceneNameLanguageKey: this.appData.nameLanguageKey,
      SceneSectionLanguageKey: this.appData.sceneSectionNameLanguageKey,
      ActualSceneNameLanguageKey: this.appData.nameLanguageKey,
      // Start of the recording - UTC
      StartDate: this.dataservice.recordingStartTime,
      // End of the recording - UTC
      EndDate: this.dataservice.recordingEndTime,
      // static value
      Status: 10,
      // Generate unique
      UserSession: uuidv4(),
      // static
      SimulatorIdentifier: 'cc43f6cb-d382-4783-a337-6532e3b2cdb1',
      // Version of the BoxTrainer WebApp
      SimulatorVersion: environment.version,
      // static
      UserInterfaceVersion: 'N/A',
      // Sum of Score(ReportItems + Questionnaire + Assessment screenshots)
      Score:
        Math.round(this.recordinScore) +
        this.selfAssessImage.score +
        this.totalScore,
      // Sum of MaxScore(ReportItems + Questionnaire + Assessment screenshots)
      MaxScore: 50 + this.screenshotsData.maxScore + this.totalMaxScore,
      //evakuation scren Rating
      SelfAssesmentRating: this.val,

      Questionnaire: {
        Score: this.totalScore,
        MaxScore: this.totalMaxScore,
        Pages: [
          {
            PageType: this.appData.questionnaire.pages[1].pageType,
            Rows: this.appData.questionnaire.pages[1].rows,
            Columns: this.appData.questionnaire.pages[1].columns,
            Sections: [
              {
                Rows: this.appData.questionnaire.pages[1].sections[0].rows,
                Columns:
                  this.appData.questionnaire.pages[1].sections[0].columns,
                Row: this.appData.questionnaire.pages[1].sections[0].row,
                Column: this.appData.questionnaire.pages[1].sections[0].column,
                RowSpan:
                  this.appData.questionnaire.pages[1].sections[0].rowSpan,
                ColumnSpan:
                  this.appData.questionnaire.pages[1].sections[0].columnSpan,
                Questions: questions,
                NameLanguageKey:
                  this.appData.questionnaire.pages[1].sections[0]
                    .nameLanguageKey,
                DescriptionLanguageKey:
                  this.appData.questionnaire.pages[1].sections[0]
                    .descriptionLanguageKey,
                SortId: 0,
                IsVisible: true,
                Identifier:
                  this.appData.questionnaire.pages[1].sections[0].identifier,
              },
            ],
            NameLanguageKey:
              this.appData.questionnaire.pages[1].nameLanguageKey,
            DescriptionLanguageKey:
              this.appData.questionnaire.pages[1].descriptionLanguageKey,
            SortId: 0,
            IsVisible: true,
            Identifier: this.appData.questionnaire.pages[1].identifier,
          },
          {
            PageType: 2,
            Score: this.selfAssessImage.score,
            MaxScore: this.screenshotsData.maxScore,
            // taken screenshot by user -> Screenshots[0].Id
            ScreenshotIdentifier: this.selfAssessImage.identifier,
            // pages[PageType == 2].screenshots[0].imageBlobName
            SelectedAssessmentImageBlobName: this.selfAssessImage.url,
            // pages[PageType == 2].nameLanguageKey
            NameLanguageKey: this.appData.identifier,
            // pages[PageType == 2].descriptionLanguageKey
            DescriptionLanguageKey: this.screenshotsData.descriptionLanguageKey,
            SortId: 1,
            IsVisible: true,
            Identifier: this.screenshotsData.identifier,
          },
        ],
        NameLanguageKey: this.appData.questionnaire.nameLanguageKey,
        DescriptionLanguageKey:
          this.appData.questionnaire.descriptionLanguageKey,
        SortId: 0,
        IsVisible: true,
        Identifier: this.appData.questionnaire.identifier,
      },
      ReportSections: [
        {
          SortId: 0,
          IsVisible: true,
          // reportSections.nameLanguageKey
          NameLanguageKey: this.appData.reportSections[0].nameLanguageKey,
          // reportSections.identifier
          SectionIdentifier: this.appData.reportSections[0].identifier,
          //
          // Calculated from report items
          Score: Math.round(this.recordinScore),
          // Calculated from report items
          MaxScore: this.exerciseData.maxScore,
          ReportItems: [
            {
              //"BestIs": 5,
              // ideally if backend can handle numbers and string values at the same time
              bestIs: this.exerciseData.bestIs,
              DescriptionLanguageKey: this.exerciseData.descriptionLanguageKey,
              DisplayMode: this.exerciseData.displayMode,
              // reportSections[0].reportItems[0].goalValueString
              goalValueString: this.exerciseData.goalValueString,
              MaxValue: this.exerciseData.maxValue,
              MinValue: this.exerciseData.minValue,
              NoScore: this.exerciseData.noScore,
              ReportItemTags: [
                {
                  SortId: 0,
                  ReferenceName: null,
                  ReferenceGuid: null,
                  TagType: 2,
                },
                {
                  SortId: 1,
                  ReferenceName: null,
                  ReferenceGuid: null,
                  TagType: 1,
                },
                {
                  SortId: 2,
                  ReferenceName: null,
                  ReferenceGuid: null,
                  TagType: 3,
                },
              ],
              ReportMode: 0,
              Score: Math.round(this.recordinScore),
              MaxScore: this.exerciseData.maxScore,
              Unit: 'Second',
              // time recording of video in seconds
              Value:
                Number(this.dataservice.displayTimer.split(':')[0] * 60) +
                Number(this.dataservice.displayTimer.split(':')[1]),
              Id: this.exerciseData.identifier,
              SortId: 0,
              IsVisible: true,
              // reportSections[0].reportItems[0].NameLanguageKey
              NameLanguageKey: this.exerciseData.nameLanguageKey,
            },
          ],
        },
      ],
      // please try to somehow compose it in JS, if not Backend will make this info optional
      // user taken & selected screenshot
      Screenshots: screenshots,
      Movies: [
        {
          // not needed now probably
          NameLanguageKey: 'Random description 21 SimulationMockVideo.mp4',
          // Generate unique
          Id: uuidv4(),
          // only extension is important
          FileName: `MovieFileName.${
            this.dataservice.videoData.mimeType === 'video/mp4' ? 'mp4' : 'webm'
          }`,
          FileGeneratedName: null,
        },
      ],
    };

    const videoBlob = this.dataservice.videoData;
    videoBlob.id = this.finalObj.Movies[0].Id;
    this.dataservice.videoBlob.push(videoBlob);
  }

  ngOnDestroy() {
    if (this.indexDbSubscription) {
      this.indexDbSubscription.unsubscribe();
    }
  }

  onSlidebarOpen(value: boolean): void {
    this.isSidebarOpen = value;
  }

  onSlidebarClose(): void {
    this.isSidebarOpen = false;
    this.headerService.isInfoOpen = false;
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
  ansChanged(event: string): void {
    if (event === 'Goal') {
      this.isGoal = true;
    } else {
      this.isGoal = false;
    }
  }
  goalImage(): void {
    this.isGoal = true;
  }
  selfAssest(): void {
    this.isGoal = false;
  }

  get appData() {
    return this.dataservice.appData;
  }

  get branding() {
    return this.dataservice.branding;
  }

  onSubmit() {
    this.dataservice.setLoader(true);
    this.createReqData();
    this.dataservice.submitData(this.reportGuid, this.finalObj).subscribe(
      (res) => {
        this.totalMedia = Object.keys(res).length;
        this.uploadMedia(res);
      },
      () => {
        this.dataservice.setLoader(false);
        this.dataservice.showError(
          'Some issue occured. Please contact your administrator!'
        );
      }
    );
  }

  uploadMedia(res) {
    const allMedia = [
      ...this.dataservice.screenShotsBlob,
      ...this.dataservice.videoBlob,
    ];
    allMedia.forEach((m) => {
      if (res[m.id]) {
        this.uploadFile(m, res[m.id]);
      }
    });
  }

  uploadFile(file, url) {
    this.dataservice.uploadMedia(file.blob, file.mimeType, url).subscribe(
      (res) => {
        this.count++;
        if (this.count === this.totalMedia) {
          this.evolutionService.setCancelValue(false);
          this.router.navigate(['/end']);
          this.dataservice.setLoader(false);
        }
      },
      () => {
        this.dataservice.showError('Error while uploading files.');
        this.dataservice.setLoader(false);
      }
    );
  }

  showDialog(url) {
    this.display = true;
    this.popupImageUrl = url;
  }
  moveLastArrayElementToFirstIndex(this_array) {
    this_array.splice(0, 0, this_array[this_array.length - 1]);
    this_array.pop();
    return this_array;
  }

  recordingTime(): number {
    const time = this.dataservice.displayTimer.split(':');
    const totalSeconds = Number(time[0]) * 60 + Number(time[1]);
    if (
      this.exerciseData.bestIs === RecordingEnum.maxValue ||
      this.exerciseData.bestIs === RecordingEnum.zaroMax
    ) {
      if (totalSeconds <= this.exerciseData.minValue) return 0;
      else if (totalSeconds >= this.exerciseData.maxValue)
        return this.exerciseData.maxScore;
      else
        return (
          (this.exerciseData.maxScore *
            (totalSeconds - this.exerciseData.minValue)) /
          (this.exerciseData.maxValue - this.exerciseData.minValue)
        );
    } else if (
      this.exerciseData.bestIs === RecordingEnum.minValue ||
      this.exerciseData.bestIs === RecordingEnum.zeroMin
    ) {
      if (totalSeconds >= this.exerciseData.maxValue) return 0;
      else if (totalSeconds <= this.exerciseData.minValue)
        return this.exerciseData.maxScore;
      else
        return (
          this.exerciseData.maxScore *
          (1.0 -
            (totalSeconds - this.exerciseData.minValue) /
              (this.exerciseData.maxValue - this.exerciseData.minValue))
        );
    } else if (this.exerciseData.bestIs === RecordingEnum.minMax) {
      if (totalSeconds === this.exerciseData.maxValue) {
        return this.exerciseData.maxScore;
      } else return 0;
    } else return this.exerciseData.maxScore;
  }
}
