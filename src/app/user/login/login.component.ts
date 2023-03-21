import { Component, OnInit } from '@angular/core';
import { AngularFireAuth,  } from '@angular/fire/compat/auth';
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from "firebase/auth";





@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = {
    email:"",
    password:""
  }
  showAlert = false
  alertMsg = "Please wait! We are logging you in."
  alertColor = "blue"
  inSubmission = false
  hi = getAuth()

  constructor(private auth: AngularFireAuth) { }

  async login() {
    this.showAlert = true
    this.alertMsg = "Please wait! We are logging you in."
    this.alertColor = "blue"
    this.inSubmission = true
    

    setPersistence(this.hi, browserSessionPersistence)
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return signInWithEmailAndPassword(this.hi, this.credentials.email, this.credentials.password);
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  });
    
/* Old Version

    try{
    
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email, this.credentials.password
      )
    } catch(e) {
      this.inSubmission = false
      this.alertMsg = "An unexpected error occurred. Please try later again."
      this.alertColor = "red"

      console.log(e)

      return
    }
    this.alertMsg = "Success! You are now logged in."
    this.alertColor = "green"

    */
    this.alertMsg = "Success! You are now logged in."
    this.alertColor = "green"
  }



  ngOnInit(): void {
    


  }

}
