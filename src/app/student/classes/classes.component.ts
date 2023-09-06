import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { InstructorService } from 'src/app/shared/instructor.service';
import { Instructor, Schedule } from 'src/app/shared/model';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {

  tommorowSchedule: Schedule;
  showTommorowSchedule: boolean = false;
  afterTommorowSchedule: Schedule;
  showAfterTommorowSchedule: boolean = false;
  studentId: string;
  datesArray: string[];
  loaderText = ''

  constructor(private instructorService: InstructorService, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.spinner.show()
    this.loaderText = 'loading upcoming classes'
    this.datesArray = this.getTomorrowAndDayAfterTomorrowDates();
    this.getStudentId();
    this.getTomrrowClassData();
    this.getAfterTomrrowClassData();
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
    const datesArray = [tomorrowFormatted, dayAfterTomorrowFormatted];
    return datesArray;
  }

  formatDate(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getStudentId() {
    const user = localStorage.getItem('user')
    if (user) {
      this.studentId = JSON.parse(user).localId
    }
  }

  getTomrrowClassData() {
    this.instructorService.getUpcomingClassByDateAndStudentId(this.datesArray[0], this.studentId).then(data => {
      // console.log(data)
      if (data === null) {
        this.showTommorowSchedule = false;
      } else {
        this.showTommorowSchedule = true
        this.tommorowSchedule = data as Schedule;
      }
      this.spinner.hide();
      this.loaderText = ''

    }).catch(err => {
      // console.log(err)
      this.toastr.error('error while loading upcoming classes')
      this.spinner.hide();
      this.loaderText = ''
    })
  }

  getAfterTomrrowClassData() {
    this.spinner.show()
    this.loaderText = 'loading upcoming classes';
    this.instructorService.getUpcomingClassByDateAndStudentId(this.datesArray[1], this.studentId).then(data => {
      if (data === null) {
        this.showAfterTommorowSchedule = false;
      } else {
        this.showAfterTommorowSchedule = true
        this.afterTommorowSchedule = data as Schedule;
      }
      this.spinner.hide();
      this.loaderText = ''

    }).catch(err => {
      // console.log(err)
      this.toastr.error('error while loading upcoming classes')
      this.spinner.hide();
      this.loaderText = ''
    })
  }


}
