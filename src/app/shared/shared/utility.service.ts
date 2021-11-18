import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  database;
  indexDB = new BehaviorSubject(null);

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

  initDatabase() {
    let db;
    const dbReq = indexedDB.open('myDatabase', 1);

    dbReq.onupgradeneeded = (event: any) => {
      db = event.target.result;
      db.createObjectStore('recording', { autoIncrement: true });
    };
    dbReq.onsuccess = (event: any) => {
      db = event.target.result;
      this.indexDB.next(db);
    };
    dbReq.onerror = (event: any) => {
      alert('error opening database ' + event.target);
    };
  }

  getImageBlob(data) {
    const contentType = 'image/png';
    const newData = data.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    return this.getBlobData(newData, contentType);
  }

  getBlobData(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
