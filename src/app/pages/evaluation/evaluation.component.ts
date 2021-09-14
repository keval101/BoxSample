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

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
  animations: [fadeAnimation],
})
export class EvaluationComponent implements OnInit {
  recording: boolean;
  ans: string = 'Goal';
  val: number = 3;
  isSidebarOpen: boolean = false;
  cancelValue: boolean = true;
  resultImage: any;
  isGoal: boolean = true;
  id: any;
  cancelText: string;

  @ViewChild('sidenav') sidenav: ElementRef;

  scores: any[] = [
    {
      title: 'Exercise duration',
      measured: '01:33',
      goalvalue: '< 02.00',
      score: 50,
    },
    {
      title: 'Self assessment',
      measured: '50%',
      goalvalue: '100%',
      score: 25,
    },
    {
      title: 'Questions',
      measured: '80%',
      goalvalue: '100%',
      score: 40,
    },
  ];

  constructor(
    private router: Router,
    public TranslateService: TranslateService,
    private evolutionService: EvolutionService,
    private confirmationService: ConfirmationService,
    private takescreenshotService: TakescreenshotService,
    private selfAssesmentService: SelfAssesmentService
  ) {
    this.id = this.selfAssesmentService.imageIndex;
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
    this.TranslateService.get('evaluation.cancelText').subscribe(
      (text: string) => {
        this.cancelText = text;
      }
    );
    this.recording = true;
    this.evolutionService.cancelValue = false;
    this.resultImage = this.takescreenshotService.resultImageSource;
    this.id = 0;
  }

  redirectTo() {
    this.router.navigate(['/end']);
  }

  onSlidebarOpen(value) {
    this.isSidebarOpen = value;
  }

  onSlidebarClose() {
    this.isSidebarOpen = false;
  }

  confirm() {
    this.confirmationService.confirm({
      message: this.cancelText,
      accept: () => {
        this.evolutionService.cancelValue = true;
        this.router.navigate(['/end']);
      },
    });
  }

  onCancelExersice() {
    this.confirmationService.confirm({
      message: this.cancelText,
      accept: () => {
        this.evolutionService.cancelValue = true;
        this.router.navigate(['/end']);
      },
    });
  }
  ansChanged(event) {
    if (event == 'Goal') {
      this.isGoal = true;
    } else {
      this.isGoal = false;
    }
  }
}
