import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from 'src/app/features/header/header.service';
import { fadeAnimation } from '../../shared/app.animation';
@Component({
  selector: 'app-videoscreen',
  templateUrl: './videoscreen.component.html',
  styleUrls: ['./videoscreen.component.scss'],
  animations: [fadeAnimation],
})
export class VideoscreenComponent implements OnInit, AfterViewInit{
  recording: boolean;
  isScreenShot: boolean;
  isVideoScreen:boolean
  playVideo:boolean;
  videoFullScreen:boolean = false;
  width:number;
  val: number = 30;

  @ViewChild('video') video:ElementRef;

  constructor( private Translateservice: TranslateService, private router:Router, private headerService:HeaderService) {
    this.headerService.videoFullscreen.subscribe( res =>{

      if(res == true){
        this.videoFullScreen = true
      } else{
        this.videoFullScreen = false
      }
    })
   }

  ngOnInit(): void {
    this.isScreenShot = true;
    this.recording = true;
    this.isVideoScreen = true;
    this.width = window.innerWidth
  };

  togglePlayPause(){
    if(this.video.nativeElement.paused){
      this.playVideo = true
      this.video.nativeElement.play()
    }
    else{
      this.playVideo = false
      this.video.nativeElement.pause()
    }
  };

  ngAfterViewInit() {
    this.video.nativeElement.addEventListener('timeupdate', ()=>{
      var progressBar = document.getElementById('progressBar')
      var time = this.video.nativeElement.currentTime / this.video.nativeElement.duration;
      progressBar.style.width = time * 100 + "%";
      if(this.video.nativeElement.ended){
        this.playVideo = false
      }

    document.getElementById('seekbar').addEventListener('click', (e) => {
      const progressTime = (e.offsetX / this.width) *   this.video.nativeElement.duration
      this.video.nativeElement.currentTime = progressTime;
    })
    } );
  }

  onPlayPause(){
    this.togglePlayPause()
   };
   
   onRestart(){
    if(this.video.nativeElement.currentTime > 0 ){
      if(this.playVideo === true){
      this.video.nativeElement.currentTime = 0;
        this.playVideo = true
        this.video.nativeElement.play()
      }else if(this.playVideo === false){
      this.video.nativeElement.currentTime = 0;
        this.playVideo = false
        this.video.nativeElement.pause()
      }

    } 
   }

   volumeChanged(e){
    if (e.cancelable) {
      e.preventDefault();
   }
     this.val = e
     this.video.nativeElement.volume = this.val / 100
   }

   redirectToBack(){
     this.router.navigate(['/intro'])
   }

   redirectTo(){
    this.router.navigate(['/setup'])
   }
}
