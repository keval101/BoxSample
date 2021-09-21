import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor() {}

  iosDetector(): boolean | void {
    if (
      navigator.userAgent.search('iOS') !== -1 ||
      navigator.userAgent.search('Mac') !== -1
    ) {
      return true;
    }
  }

  iosScrollDis(e): void {
    let xStart = 0;
    let yStart = 0;
    xStart = e.touches[0].pageX;
    yStart = e.touches[0].pageY;
    const xMovement = Math.abs(e.touches[0].pageX);
    const yMovement = Math.abs(e.touches[0].pageY);
    if (xMovement > yMovement) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
}
