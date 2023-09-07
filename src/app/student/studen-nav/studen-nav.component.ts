import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { InstructorService } from 'src/app/shared/instructor.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-studen-nav',
  templateUrl: './studen-nav.component.html',
  styleUrls: ['./studen-nav.component.css']
})
export class StudenNavComponent implements OnInit {

  numberOfNotifications: number;
  numberOfFeedbacks: number;
  StudentId: string;
  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);
  unsub: any;
  unsub1: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getStudentId()

    this.unsub = onSnapshot(doc(this.db, "studentNotifications", this.StudentId), (doc) => {
      const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      if (doc.exists()) {
        this.numberOfNotifications = doc.data()['notifications'].length
      }
      else {
        this.numberOfNotifications = 0
      }
      
    });

    this.unsub1 = onSnapshot(doc(this.db, "studentFeedbacks", this.StudentId), (doc) => {
      const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      if (doc.exists()) {
        this.numberOfFeedbacks = doc.data()['feedbacks'].length
      }
      else {
        this.numberOfFeedbacks = 0
      }
  
    });
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    this.router.navigateByUrl('/login')
  }

  getStudentId() {
    const user = localStorage.getItem('user')
    if (user) {
      this.StudentId = JSON.parse(user).localId
    }
  }

}

