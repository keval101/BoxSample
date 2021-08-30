import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecordingService {
  fullscreen: boolean = false;
  cameraidValue:any;
  recordTimeDuration = new Subject()
  constructor() {}
}
