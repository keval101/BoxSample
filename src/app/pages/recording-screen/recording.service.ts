import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecordingService {
  fullscreen: boolean = false;
  cameraidValue;
  constructor() {}
}
