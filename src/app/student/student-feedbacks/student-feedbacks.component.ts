import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { Feedback } from 'src/app/shared/model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-student-feedbacks',
  templateUrl: './student-feedbacks.component.html',
  styleUrls: ['./student-feedbacks.component.css']
})
export class StudentFeedbacksComponent implements OnInit {

  zeroFeedbacks: boolean = false;
  feedbacks: Feedback[] = [];
  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);
  unsub: any;
  StudentId: string;

  constructor() {
    this.getStudentId();
    this.unsub = onSnapshot(doc(this.db, "studentFeedbacks", this.StudentId), (doc) => {
      const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      if (doc.exists()) {
        this.feedbacks = doc.data()['feedbacks']
      }
      else {
        this.zeroFeedbacks = true;
      }
      let data: any;
      data = doc.data()
    });
  }

  ngOnInit(): void {
  }

  getStudentId() {
    const user = localStorage.getItem('user')
    if (user) {
      this.StudentId = JSON.parse(user).localId
    }
  }

}
