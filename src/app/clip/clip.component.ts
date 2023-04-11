import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, ViewEncapsulation, SimpleChanges} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import videojs from 'video.js';
import Iclip from '../models/clip.model';
import { DatePipe } from '@angular/common';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore'
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth } from '@firebase/auth';
import { map,  Observable} from 'rxjs';
import IUser from '../models/user.model';
import Icomment from '../models/comment.model';
import {serverTimestamp} from "firebase/firestore"
import { FormBuilder,FormControl,FormGroup } from '@angular/forms';




@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class ClipComponent implements OnInit, AfterViewChecked {
  @ViewChild("videoPlayer", { static: true }) target?: ElementRef;
  @ViewChild("writecomment", {static: false})  writecomment?: ElementRef;
  player?: videojs.Player
  clip?: Iclip
  public Comments: AngularFirestoreCollection
  Comment: any
  currentUseruid = getAuth().currentUser?.uid.toString()
  ActualUser: AngularFirestoreCollection<IUser>
  actualURL?: string
  UserList?: Observable<any>
  UserName?: any
  CommentList?: Icomment[] = []
  allComments?: Icomment[] = []
  commentButton = false
  update = false
  activatedUpdate: any

  comment = new FormControl("")
  
  form = new FormGroup({
    comment: this.comment
  })


  

  constructor(
    public route: ActivatedRoute, 
    private db: AngularFirestore, 
    private auth: AngularFireAuth,
   
   
    ) {
    this.Comments = db.collection("clips")
    this.ActualUser = db.collection("users")

    }
    
   
    ngAfterViewChecked(): void {
      if(this.update == true) {
        this.writecomment?.nativeElement.scrollIntoView({
        
        })

      }
    
    }


  ngOnInit(): void {
    //getUserlist
    this.ActualUser.valueChanges({ idField: "id"}).pipe(
      map((x:any) => {
        x.map((y: any) => {
          if(y.id == this.currentUseruid) {
            this.UserName = y.name
          }
        })
      })
    ).subscribe()

    //Videoplayer
    
    this.player = videojs(this.target?.nativeElement)
    console.log(this.target?.nativeElement)
    
    this.route.data.subscribe(data => {
      this.clip = data.clip as Iclip
      this.actualURL = this.route.snapshot.url[1].path
      this.player?.src({
        src: this.clip.url,
        type: "video/mp4"
      })
      this.getNewstComments()
    })

  }

    getNewstComments() {
      this.db.collection<Icomment>(`clips/${this.actualURL}/comments`, ref => ref.orderBy("timestamp","desc"))
      .snapshotChanges()
      .subscribe(
        res => {
          this.allComments = res.map ( e => {
             return {
                id: e.payload.doc.id,
                ...e.payload.doc.data() as {}
              } as Icomment
          })
        }
      )
      
    }

    postComment() {

      this.db.collection("clips").doc(this.actualURL).collection("comments").add({
        Author: this.UserName,
        comment: this.comment.value,
        timestamp: serverTimestamp(),
        uid: this.currentUseruid,
        path: this.actualURL

    })

    this.form.reset()

  

    }

    deleteComment(id: any){
      return this.db.collection("clips")
      .doc(this.actualURL).
      collection("comments")
      .doc(id)
      .delete()
      
    }

    updateComment(){
      
      return this.db.collection("clips")
      .doc(this.actualURL).
      collection("comments")
      .doc(this.activatedUpdate.id)
      .update({
        comment: this.comment.value
      })

     

    }

    updateButton(comments:Icomment) {
      this.form.get("comment")?.setValue(comments.comment)
      this.update = true

      this.activatedUpdate = comments

      
    }
    
}


