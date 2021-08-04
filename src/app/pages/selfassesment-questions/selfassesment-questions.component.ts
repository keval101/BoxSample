import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-selfassesment-questions',
  templateUrl: './selfassesment-questions.component.html',
  styleUrls: ['./selfassesment-questions.component.scss'],
})
export class SelfassesmentQuestionsComponent implements OnInit {
  recording: boolean;
  isScreenShot: boolean;

  questions = [
    {
      id: 1,
      question: 'My knot was tied tightly and in the correct location',
      options: {
        opt1: 'Yes',
        opt2: 'No',
      },
    },
    {
      id: 2,
      question: 'My knot was tied tightly and in the correct location',
      options: {
        opt1: 'Yes',
        opt2: 'No',
      },
    },
    {
      id: 3,
      question: 'Another question',
      options: {
        opt1: 'Yes',
        opt2: 'No',
      },
    },
  ];

  constructor(
    private router: Router,
    public TranslateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.isScreenShot = true;
    this.recording = true;
  }

  redirectTo() {
    this.router.navigate(['/evaluation']);
  }
}
