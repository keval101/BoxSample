import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecordingService {
  fullscreen = false;
  cameraidValue;
  recordTimeDuration = new Subject();
  finalRecordDuration;
  sceenShots = [];
}
