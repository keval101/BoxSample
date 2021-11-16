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
import { Router } from '@angular/router';
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
  @ViewChild('sidenav') sidenav: ElementRef;

  scores = [];

  exerciseData;
  screenshotsData;
  totalScore = 0;
  totalMaxScore = 0;
  allHint = [];
  questionData;
  questionName;
  exerciseName;
  indexDB;
  indexDbSubscription: Subscription;
  display = false;
  popupImageUrl: string;
  recordinScore;
  finalObj;

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
    private dataservice: DataService,
    private selfAssesQueSer: SelfAssesmentQuestionService
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
    this.indexDbSubscription = this.utility.indexDB.subscribe((res) => {
      if (res && !this.indexDB) {
        this.indexDB = res;
        this.getAndDisplayData(res);
      } else if (!this.indexDB) {
        this.utility.initDatabase();
      }
    });
    this.questionData = this.appData.selfAssessmentQuestions;
    this.selfAssessImage = this.appData.selfAssessment;
    this.questionName = this.appData.case.questionnaire.pages[1].sections[0];
    this.translateService
      .get('evaluation.cancelText')
      .subscribe((text: string) => {
        this.cancelText = text;
      });
    this.exerciseData = this.appData.case.reportSections[0].reportItems[0];
    this.screenshotsData = this.appData.case.questionnaire.pages[0];
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
        measured: this.appData.recordingTime,
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
        title: this.questionName.name,
        measured: totalScoreforQue.toFixed(0) + '%',
        goalvalue: '100%',
        score: this.totalScore + ' / ' + this.totalMaxScore,
      },
    ];
  }

  createReqData() {
    const questions = [];
    const screenshots = [];
    this.questionName.questions.forEach((element, index) => {
      const question = {
        // calculated from Answers
        Score: this.appData.selfAssessmentQuestions[index].score,
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
              this.appData.selfAssessmentQuestions[index].selectedAns,
            // "score" from SceneDetails endpoint response
            ScoreDefined: element.answers[0].score,
            // "penaltyScore" from SceneDetails endpoint response
            PenaltyScoreDefined: element.answers[0].penaltyScore,
            // you will calculate
            ScoreEvaluated: this.appData.selfAssessmentQuestions[index].score,
            IsSelected:
              this.appData.selfAssessmentQuestions[index].optionName === 'Yes'
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
              this.appData.selfAssessmentQuestions[index].selectedAns,
            // "score" from SceneDetails endpoint response
            ScoreDefined: element.answers[1].score,
            // "penaltyScore" from SceneDetails endpoint response
            PenaltyScoreDefined: element.answers[1].penaltyScore,
            // you will calculate
            ScoreEvaluated: this.appData.selfAssessmentQuestions[index].score,
            IsSelected:
              this.appData.selfAssessmentQuestions[index].optionName === 'No'
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

    this.items.forEach((element) => {
      screenshots.push({
        GroupLanguageKey: '',
        DescriptionLanguageKey: 'Measurement screenshot description',
        NameLanguageKey: 'Measurement screenshot name',
        SortId: 0,
        Id: uuidv4(),
        FileName: 'ScreenshotFileName.png',
        FileGeneratedName: null,
      });
    });

    this.finalObj = {
      // Generate unique
      Id: uuidv4(),
      //data.identifier
      ActualSceneIdentifier: this.appData.case.identifier,
      //data.identifier
      SceneIdentifier: this.appData.case.identifier,
      SceneNameLanguageKey: this.appData.case.nameLanguageKey,
      SceneSectionLanguageKey: this.appData.case.sceneSectionNameLanguageKey,
      ActualSceneNameLanguageKey: this.appData.case.nameLanguageKey,
      // Start of the recording - UTC
      StartDate: this.appData.startRecordingTime,
      // End of the recording - UTC
      EndDate: this.appData.endRecordingTime,
      // static value
      Status: 10,
      // Generate unique
      UserSession: uuidv4(),
      // static
      SimulatorIdentifier: 'cc43f6cb-d382-4783-a337-6532e3b2cdb1',
      // Version of the BoxTrainer WebApp
      SimulatorVersion: '1.2.1.48',
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
            PageType: this.appData.case.questionnaire.pages[1].pageType,
            Rows: this.appData.case.questionnaire.pages[1].rows,
            Columns: this.appData.case.questionnaire.pages[1].columns,
            Sections: [
              {
                Rows: this.appData.case.questionnaire.pages[1].sections[0].rows,
                Columns:
                  this.appData.case.questionnaire.pages[1].sections[0].columns,
                Row: this.appData.case.questionnaire.pages[1].sections[0].row,
                Column:
                  this.appData.case.questionnaire.pages[1].sections[0].column,
                RowSpan:
                  this.appData.case.questionnaire.pages[1].sections[0].rowSpan,
                ColumnSpan:
                  this.appData.case.questionnaire.pages[1].sections[0]
                    .columnSpan,
                Questions: questions,
                NameLanguageKey:
                  this.appData.case.questionnaire.pages[1].sections[0]
                    .nameLanguageKey,
                DescriptionLanguageKey:
                  this.appData.case.questionnaire.pages[1].sections[0]
                    .descriptionLanguageKey,
                SortId: 0,
                IsVisible: true,
                Identifier:
                  this.appData.case.questionnaire.pages[1].sections[0]
                    .identifier,
              },
            ],
            NameLanguageKey:
              this.appData.case.questionnaire.pages[1].nameLanguageKey,
            DescriptionLanguageKey:
              this.appData.case.questionnaire.pages[1].descriptionLanguageKey,
            SortId: 0,
            IsVisible: true,
            Identifier: this.appData.case.questionnaire.pages[1].identifier,
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
            NameLanguageKey: this.appData.case.identifier,
            // pages[PageType == 2].descriptionLanguageKey
            DescriptionLanguageKey: this.screenshotsData.descriptionLanguageKey,
            SortId: 1,
            IsVisible: true,
            Identifier: this.screenshotsData.identifier,
          },
        ],
        NameLanguageKey: this.appData.case.questionnaire.nameLanguageKey,
        DescriptionLanguageKey:
          this.appData.case.questionnaire.descriptionLanguageKey,
        SortId: 0,
        IsVisible: true,
        Identifier: this.appData.case.questionnaire.identifier,
      },
      ReportSections: [
        {
          SortId: 0,
          IsVisible: true,
          // reportSections.nameLanguageKey
          NameLanguageKey: this.appData.case.reportSections[0].nameLanguageKey,
          // reportSections.identifier
          SectionIdentifier: this.appData.case.reportSections[0].identifier,
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
              Unit: 5,
              // time recording of video in seconds
              Value:
                Number(this.appData.recordingTime.split(':')[0] * 60) +
                Number(this.appData.recordingTime.split(':')[1]),
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
      TimeZoneString:
        'W. Europe Standard Time;60;(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna;W. Europe Standard Time;W. Europe Daylight Time;[01:01:0001;12:31:9999;60;[0;02:00:00;3;5;0;];[0;03:00:00;10;5;0;];];',
      // user taken & selected screenshot
      Screenshots: screenshots,
      Movies: [
        {
          // not needed now probably
          NameLanguageKey: 'Random description 21 SimulationMockVideo.mp4',
          // Generate unique
          Id: uuidv4(),
          // only extension is important
          FileName: 'MovieFileName.mp4',
          FileGeneratedName: null,
        },
      ],
    };
  }

  ngOnDestroy() {
    if (this.indexDbSubscription) {
      this.indexDbSubscription.unsubscribe();
    }
  }

  getAndDisplayData(db) {
    const tx = db.transaction(['recording'], 'readonly');
    const store = tx.objectStore('recording');
    const req = store.openCursor();
    const allRecording = [];

    req.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor != null) {
        allRecording.push(cursor.value);
        cursor.continue();
      } else {
        if (allRecording.length) {
          let arr = [];
          allRecording.forEach((element) => {
            if (element.screenshotData) {
              arr.push(element.screenshotData);
            }
            if (element.screenshots) {
              arr = [...arr, ...element.screenshots];
            }
          });
          this.items = this.moveLastArrayElementToFirstIndex(arr);
        }
      }
    };
    req.onerror = (event) => {
      alert('error in cursor request ' + event.target.errorCode);
    };
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
    return JSON.parse(this.dataservice.getSessionData('caseData'));
  }

  onSubmit() {
    this.createReqData();
    // console.log(this.encrypt(this.finalObj));
    this.dataservice
      .submitData(
        'f3cefa4a-83c9-473c-8883-3a46f2ff4f2c',
        this.encrypt(this.finalObj)
      )
      .subscribe((res) => {});
    this.evolutionService.setCancelValue(false);
    // console.log(this.finalObj);
    this.router.navigate(['/end']);
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
    const time = this.appData.recordingTime.split(':');
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

  encrypt(data) {
    const keyString = 'fxhToKHXW82SlxvdfrYsIXMak2RdmpLD';
    const Key = CryptoJS.enc.Utf8.parse(keyString);
    const IV = CryptoJS.lib.WordArray.random(16);
    const val = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    const encrypted = CryptoJS.AES.encrypt(val, Key, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
    const b64 = encrypted.toString(CryptoJS.enc.Hex);
    return b64;
  }
}
