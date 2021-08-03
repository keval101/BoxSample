import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EvaluationComponent } from '../evaluation/evaluation.component';

@Component({
  selector: 'app-end-screen',
  templateUrl: './end-screen.component.html',
  styleUrls: ['./end-screen.component.scss'],
})
export class EndScreenComponent implements OnInit {
  constructor(public TranslateService: TranslateService) {}

  recording: boolean;
  isScreenShot: boolean;

  ngOnInit(): void {
    this.isScreenShot = true;
    this.recording = true;
  }
}
