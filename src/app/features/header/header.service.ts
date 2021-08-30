import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  videoFullscreen = new Subject<boolean>();
  muteUnmuteMic = new Subject<boolean>()
  muteMic:boolean = false
  constructor() {}
}
