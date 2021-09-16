import { Component, OnInit } from '@angular/core';
import { EvolutionService } from '../evaluation/evolution.service';

@Component({
  selector: 'app-end-screen',
  templateUrl: './end-screen.component.html',
  styleUrls: ['./end-screen.component.scss'],
})
export class EndScreenComponent implements OnInit {
  recording: boolean;
  cancel = false;
  isEndScreen: boolean;
  constructor(private evolutionService: EvolutionService) {}

  ngOnInit(): void {
    this.recording = true;
    this.cancel = this.evolutionService.cancelValue;
    this.isEndScreen = true;
  }
}
