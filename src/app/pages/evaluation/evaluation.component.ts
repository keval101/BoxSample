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

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
  animations: [fadeAnimation],
})
export class EvaluationComponent implements OnInit {
  recording: boolean;
  ans = 'Goal';
  val = 3;
  isSidebarOpen = false;
  cancelValue = true;
  resultImage;
  isGoal = true;
  id;
  items = [];
  cancelText: string;
  responsiveOptions;
  appData;
  @ViewChild('sidenav') sidenav: ElementRef;

  scores;

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
    private dataservice: DataService
  ) {
    this.id = this.selfAssesmentService.imageIndex;
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
    this.translateService
      .get('evaluation.cancelText')
      .subscribe((text: string) => {
        this.cancelText = text;
      });
    this.items = this.moveLastArrayElementToFirstIndex(
      this.takescreenshotService.captures
    );
    this.recording = true;
    this.evolutionService.cancelValue = false;
    this.resultImage = this.takescreenshotService.resultImageSource;
    this.id = 0;

    this.headerService.appData.subscribe((res) => {
      this.appData = res;
    });

    this.scores = [
      {
        title: 'Exercise duration',
        measured: this.recordingService.finalRecordDuration,
        goalvalue: this.appData.goals.exerciseDuration,
        score: 50,
      },
      {
        title: 'Self assessment',
        measured: '50%',
        goalvalue: this.appData.goals.selfAssessment,
        score: 25,
      },
      {
        title: 'Questions',
        measured: '80%',
        goalvalue: this.appData.goals.questions,
        score: 40,
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

  moveLastArrayElementToFirstIndex(this_array) {
    this_array.splice(0, 0, this_array[this_array.length - 1]);
    this_array.pop();
    return this_array;
  }

  onSubmit() {
    this.dataservice.submitData('12345', {}).subscribe((res) => {});

    this.router.navigate(['/end']);
  }
}
