import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SetupService {
  cameraId = new Subject();
  cameraIdInformation;
}
