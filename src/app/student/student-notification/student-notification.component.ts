import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { InstructorService } from 'src/app/shared/instructor.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-student-notification',
  templateUrl: './student-notification.component.html',
  styleUrls: ['./student-notification.component.css']
})
export class StudentNotificationComponent implements OnInit {


  studentId: string
  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);
  unsub: any

  notifications: Notification[] = []
  zeroNotifications: boolean = false;


  constructor(private router: Router, private elementRef: ElementRef, private route: ActivatedRoute, private instructorService: InstructorService) { }

  ngOnInit(): void {
    this.getStudentId();
    this.unsub = onSnapshot(doc(this.db, "studentNotifications", this.studentId), (doc) => {
      const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      if (doc.exists()) {
        this.notifications = doc.data()['notifications']
      }
      else {
        this.zeroNotifications = true;
      }
      let data: any;
      data = doc.data()
      // console.log(doc.data())
    });
  }


  getStudentId() {
    const user = localStorage.getItem('user')
    if (user) {
      this.studentId = JSON.parse(user).localId
    }
  }

}
