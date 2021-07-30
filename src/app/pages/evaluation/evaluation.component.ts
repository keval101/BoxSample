import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
})
export class EvaluationComponent implements OnInit {
  constructor(
    private router: Router,
    public TranslateService: TranslateService
  ) {}

  recording: boolean;
  isScreenShot: boolean;
  ans: string = 'Goal';
  val: number = 3;

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
  ngOnInit(): void {
    this.recording = true;
    this.isScreenShot = true;
  }
}
