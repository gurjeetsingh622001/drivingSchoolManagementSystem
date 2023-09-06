import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  upcomingSchedules: any[] = [
    { date: 'October 15, 2023', time: '09:00 AM - 11:00 AM', instructor: 'John Doe', vehicleType: 'Car' },
    { date: 'October 20, 2023', time: '02:00 PM - 04:00 PM', instructor: 'Jane Smith', vehicleType: 'Scooty' },
  ];

  isDropdownOpen: boolean = false;
  constructor(private router: Router, private elementRef: ElementRef, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.upcomingSchedules = this.getTomorrowAndDayAfterTomorrowDates()
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login')
  }
  manageSchedule() {

  }

  getTomorrowAndDayAfterTomorrowDates() {
    const currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);
    const dayAfterTomorrow = new Date(currentDate);
    dayAfterTomorrow.setDate(currentDate.getDate() + 2);
    const todayFormatted = this.formatDate(currentDate);
    const tomorrowFormatted = this.formatDate(tomorrow);
    const dayAfterTomorrowFormatted = this.formatDate(dayAfterTomorrow);
    const datesArray = [todayFormatted, tomorrowFormatted, dayAfterTomorrowFormatted];
    return datesArray;
  }

  formatDate(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    setTimeout(() => {
      this.isDropdownOpen = false;
    }, 20000)
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }
  closeDropdown() {
    this.isDropdownOpen = false;
  }

}


