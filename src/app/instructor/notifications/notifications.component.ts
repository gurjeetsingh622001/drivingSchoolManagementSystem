import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { InstructorService } from 'src/app/shared/instructor.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  instructorId: string
  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);
  unsub: any

  notifications: Notification[] = []
  zeroNotifications: boolean = false;


  constructor(private router: Router, private elementRef: ElementRef, private route: ActivatedRoute, private instructorService: InstructorService) { }

  ngOnInit(): void {
    this.getInstructorId()
    this.unsub = onSnapshot(doc(this.db, "instructorNotifications", this.instructorId), (doc) => {
      const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      if (doc.exists()) {
        this.notifications = doc.data()['notifications']
      } else {
        this.zeroNotifications = true;
      }
    });
  }


  getInstructorId() {
    const user = localStorage.getItem('user')
    if (user) {
      this.instructorId = JSON.parse(user).localId
    }
  }

}
