import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'
import { last, switchMap } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  isDragover= false
  file: File | null = null
  nextStep = false
  alertColor = "green"
  showAlert = false
  alertMsg = "Successful uploaded"
  inSubmission = false
  percentage = 0
  showPercentage = false
  user: firebase.User | null = null

  title = new FormControl("", {
    validators: [
      Validators.required,
      Validators.minLength(3),
    ],
    nonNullable: true
  })

  uploadForm = new FormGroup({
    title: this.title
  })

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth
  ) { 
    auth.user.subscribe(user => this.user = user)
  }

  ngOnInit(): void {
  }

  storeFile($event: Event) {
    this.isDragover= false

    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null

    if(!this.file || this.file.type !== "video/mp4") {
      return 
    }

    this.title.setValue(
      this.file.name
    )
    
    this.nextStep = true
  }
  uploadFile(){
    this.showAlert= true
    this.alertColor = "blue"
    this.alertMsg= " Please Wait! File will be uploaded"
    this.inSubmission = true
    this.showPercentage = true

    const clipFileName = uuid()
    const clipPath= `clips/${clipFileName}.mp4`

    const task = this.storage.upload(clipPath, this.file)
    const clipRef = this.storage.ref(clipPath)

    task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100
    })

    task.snapshotChanges().pipe(
      //last() displays or logs only the last data from the Observable
      last(),
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe({
      next: (url) =>{
        const clip =  {
          uid: this.user?.uid,
          displayName: this.user?.displayName,
          title: this.title.value,
          fileName:`${clipFileName}.mp4`,
          url
        }

        console.log(clip)

        this.alertColor = "green"
        this.alertMsg = "Succes!"
        this.showPercentage = false

      },
      error: (error) => { 
        this.alertColor = "red"
        this.alertMsg = " Upload failed! Please try again later"
        this.inSubmission = false
        this.showPercentage = false
        console.error(error)
      }
    })
  }
}
