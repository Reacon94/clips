import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import videojs from 'video.js';
import Iclip from '../models/clip.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class ClipComponent implements OnInit {
  @ViewChild("videoPlayer", { static: true }) target?: ElementRef
  player?: videojs.Player
  clip?: Iclip

  constructor(public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement)
    
    this.route.data.subscribe(data => {
      this.clip = data.clip as Iclip

      this.player?.src({
        src: this.clip.url,
        type: "video/mp4"
      })
    })
  }

}
