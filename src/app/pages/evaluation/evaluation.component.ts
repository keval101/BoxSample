import {
  Component,
  ElementRef,
  HostListener,
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

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
  animations: [fadeAnimation],
})
export class EvaluationComponent implements OnInit {
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
    this.questionData = this.appData.selfAssessmentQuestions;
    this.selfAssessImage = this.appData.selfAssessment;
    this.questionName = this.appData.case.questionnaire.pages[1].sections[0];
    this.translateService
      .get('evaluation.cancelText')
      .subscribe((text: string) => {
        this.cancelText = text;
      });
    this.items = this.moveLastArrayElementToFirstIndex(this.appData.recording);
    this.exerciseData = this.appData.case.reportSections[0].reportItems[0];
    this.screenshotsData = this.appData.case.questionnaire.pages[0];
    this.recording = true;
    this.evolutionService.cancelValue = false;
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
    const recordinScore = this.recordingTime();
    this.scores = [
      {
        title: this.exerciseData.name,
        measured: this.appData.recordingTime,
        goalvalue: this.exerciseData.goalValueString,
        score:
          recordinScore < 1 && recordinScore > 0
            ? recordinScore.toFixed(2)
            : recordinScore + ' / ' + '50',
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
        this.evolutionService.cancelValue = true;
        this.router.navigate(['/end']);
      },
    });
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

  moveLastArrayElementToFirstIndex(this_array) {
    this_array.splice(0, 0, this_array[this_array.length - 1]);
    this_array.pop();
    return this_array;
  }

  onSubmit() {
    this.dataservice.submitData('12345', {}).subscribe((res) => {});

    this.router.navigate(['/end']);
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
}
