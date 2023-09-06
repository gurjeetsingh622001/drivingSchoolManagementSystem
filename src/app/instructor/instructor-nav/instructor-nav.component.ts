import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { InstructorService } from 'src/app/shared/instructor.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-instructor-nav',
  templateUrl: './instructor-nav.component.html',
  styleUrls: ['./instructor-nav.component.css']
})
export class InstructorNavComponent implements OnInit {

  instructorId: string
  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);
  unsub: any;

  upcomingSchedules: any[] = [
    { date: 'October 15, 2023', time: '09:00 AM - 11:00 AM', instructor: 'John Doe', vehicleType: 'Car' },
    { date: 'October 20, 2023', time: '02:00 PM - 04:00 PM', instructor: 'Jane Smith', vehicleType: 'Scooty' },
  ];

  numberOfNotifications: number = 0;

  isDropdownOpen: boolean = false;
  constructor(private router: Router, private elementRef: ElementRef, private route: ActivatedRoute, private instructorService: InstructorService) { }

  ngOnInit(): void {
    this.getInstructorId()

    this.unsub = onSnapshot(doc(this.db, "instructorNotifications", this.instructorId), (doc) => {
      const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      if (doc.exists()) {
        this.numberOfNotifications = doc.data()['notifications'].length
      }
      else {
        this.numberOfNotifications = 0
      }
    });

    this.upcomingSchedules = this.getTomorrowAndDayAfterTomorrowDates()
  }

  logout() {
    this.router.navigateByUrl('login')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  checkForUpComingSchedules() {
    let currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const collectionName = `schedule${year}-${month}-${day}`;
  }

  getTomorrowAndDayAfterTomorrowDates() {
    const currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);
    const dayAfterTomorrow = new Date(currentDate);
    dayAfterTomorrow.setDate(currentDate.getDate() + 2);
    const tomorrowFormatted = this.formatDate(tomorrow);
    const dayAfterTomorrowFormatted = this.formatDate(dayAfterTomorrow);
    const datesArray = [tomorrowFormatted, dayAfterTomorrowFormatted];
    return datesArray;
  }

  formatDate(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getInstructorId() {
    const user = localStorage.getItem('user')
    if (user) {
      this.instructorId = JSON.parse(user).localId
    }
  }

}
