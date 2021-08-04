import { Component, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { EvolutionService } from './evolution.service';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
})
export class EvaluationComponent implements OnInit {
  recording: boolean;
  isScreenShot: boolean;
  ans: string = 'Goal';
  val: number = 3;
  cancelValue: boolean = true;
  scores = [
    {
      title: 'Exercise Duration',
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
      title: 'Score',
      measured: '80%',
      goalvalue: '100%',
      score: 40,
    },
  ];

  constructor(
    private router: Router,
    public TranslateService: TranslateService,
    private evolutionService: EvolutionService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.recording = true;
    this.isScreenShot = true;
    this.evolutionService.cancelValue = false;
  }

  redirectTo() {
    this.router.navigate(['/end']);
  }

  confirm() {
    this.confirmationService.confirm({
      message:
        'You are going to quit without saving your exercise data. The exercise will be marked as cancelled trial in your course. ',

      accept: () => {
        this.evolutionService.cancelValue = true;
        this.router.navigate(['/end']);
      },
    });
  }
}
