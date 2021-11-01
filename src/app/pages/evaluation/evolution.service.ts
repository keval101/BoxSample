import { Injectable } from '@angular/core';
import { DataService } from 'src/app/shared/shared/data.service';

@Injectable({
  providedIn: 'root',
})
export class EvolutionService {
  cancelValue = false;

  constructor(private dataService: DataService) {
    if (dataService.getSessionData('cancelType')) {
      this.cancelValue = JSON.parse(
        dataService.getSessionData('cancelType')
      ).cancelType;
    }
  }

  setCancelValue(cancelType: boolean) {
    this.dataService.setSessionData({ cancelType }, 'cancelType');
    this.cancelValue = cancelType;
    this.dataService.preserveQueryParams('/end');
  }
}
