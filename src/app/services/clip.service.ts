import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore'
import Iclip from '../models/clip.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public cliplsCollection: AngularFirestoreCollection

  constructor(
    private db: AngularFirestore
  ) {
    this.cliplsCollection = db.collection("clips")
   }

  async createClip(data: Iclip) {
   await this.cliplsCollection.add(data)
   }
}
