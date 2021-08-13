import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RecordingService } from './recording.service';
import { fadeAnimation } from '../../shared/app.animation';
import { ChoosescreenshotService } from '../choose-screenshot/choosescreenshot.service';
import { interval, Subscription } from 'rxjs';
import videojs from 'video.js';
import * as RecordRTC from 'recordrtc';
// register videojs-record plugin with this import
import * as Record from 'videojs-record/dist/videojs.record.js';

@Component({
  selector: 'app-recording-screen',
  templateUrl: './recording-screen.component.html',
  styleUrls: ['./recording-screen.component.scss'],
  animations: [fadeAnimation],
})
export class RecordingScreenComponent implements OnInit, AfterViewInit {
  recording: boolean = false;
  isScreenShot: boolean = false;
  takeScreenshot: boolean = false;
  isSidebarOpen: boolean = false;
  counterTime:boolean = false;
  paddingClass:boolean;
  data = [3,2,1,"go"]
  text;
  // index to create unique ID for component
  idx = 'clip1';

  private config: any;
  private player: any; 
  private plugin: any;

  constructor(
    public TranslateService: TranslateService,
    private router: Router,
    private recordingService: RecordingService,
    private choosescreenshotService : ChoosescreenshotService,
    elementRef: ElementRef
  ) {
    this.player = false;

    // save reference to plugin (so it initializes)
    this.plugin = Record;

    // video.js configuration
    this.config = {
      controls: false,
      autoplay: true,
      fluid: false,
      loop: false,
      width: 320,
      height: 240,
      bigPlayButton: false,
      controlBar: {
        fullscreenToggle: false,
        volumePanel: false
      },
      plugins: {
        // configure videojs-record plugin
        record: {
          audio: true,
          video: {
            facingMode: 'environment',
          },
           // fire the timestamp event every 2 seconds
          debug: true,
          maxLength: 10000
        }
      }
    };

    
  }

  ngOnInit(): void {
    const obs = interval(1000)
    const timer:Subscription = obs.subscribe( (d) => {
      this.counterTime = true;
      let text = this.data[d];
      this.text = text

      if(d == 3){
        this.paddingClass = true
      }
    })
    setTimeout(() => {
        timer.unsubscribe()
        this.counterTime = false
    }, 5000);

    setTimeout( () => {
      this.videoInitialize()
    },500)

    if(this.choosescreenshotService.backToScreen == true){
      timer.unsubscribe()
      this.takeScreenshot = true;
      this.recording = true;
      this.isScreenShot = true;
    }
  }

  onRetake() {
    this.takeScreenshot = false;
  }

  onDone() {
    this.router.navigate(['/choosescreenshot']);
  }

  onFinish() {
    this.recordingService.fullscreen = false;
    this.recording = true;
    this.isScreenShot = true;
    this.isSidebarOpen = false;
    this.player.record().stopDevice();
  }

  takeScreenShot() {
    this.takeScreenshot = true;
  }

  onSlidebarOpen(value) {
    this.isSidebarOpen = true;
  }

  onSlidebarClose() {
    this.isSidebarOpen = false;
  }

    // reference to the element itself: used to access events and methods
    private _elementRef: ElementRef;


// use ngAfterViewInit to make sure we initialize the videojs element
  // after the component template itself has been rendered

  ngAfterViewInit() {}

  videoInitialize(){
    let el = 'video_' + this.idx;

    // setup the player via the unique element ID
    this.player = videojs(document.getElementById(el), this.config, () => {
      // print version information at startup
      var msg = 'Using video.js ' + videojs.VERSION +
        ' with videojs-record ' + videojs.getPluginVersion('record') +
        ' and recordrtc ' + RecordRTC.version;
      videojs.log(msg);
    });

    this.player.on('ready', () => {
      this.player.record().getDevice()
    })
    this.player.on('deviceReady', () => {
      this.player.record().start()
    })
     
    // user completed recording and stream is available
    this.player.on('finishRecord', () => {
      // recordedData is a blob object containing the recorded data that
      // can be downloaded by the user, stored on server etc.
    });

    // error handling
    this.player.on('error', (element, error) => {
    });

    this.player.on('deviceError', () => {
    });
  }

}
