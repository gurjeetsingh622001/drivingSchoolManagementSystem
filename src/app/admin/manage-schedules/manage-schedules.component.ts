import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService, Spinner } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { InstructorService } from 'src/app/shared/instructor.service';
import { Schedule, Student } from 'src/app/shared/model';
import { ScheduleService } from 'src/app/shared/schedule.service';

@Component({
  selector: 'app-manage-schedules',
  templateUrl: './manage-schedules.component.html',
  styleUrls: ['./manage-schedules.component.css']
})
export class ManageSchedulesComponent implements OnInit {
  loaderText = ''
  date: string;
  noScheduleExists: boolean = false;
  schedules: Schedule[];
  constructor(private route: ActivatedRoute, private instructorService: InstructorService, private scheduleService: ScheduleService, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.date = params.date;
      this.getAssignedScheduleAccToDate();
    })

  }

  async getAssignedScheduleAccToDate() {
    this.spinner.show()
    this.loaderText = 'loading ...'
    const collectionName = `schedule${this.date}`;
    const instructor = await localStorage.getItem('user');
    let instructorId = '';

    if (instructor !== null) {
      instructorId = JSON.parse(instructor).localId;
    }
    this.scheduleService.getAssignedScheduleAccToDate(collectionName)
      .then((data: any) => {
        this.schedules = data
        if (this.schedules.length === 0) {
          this.noScheduleExists = true
          this.toastr.success('admin has not created schedule for today')
        } else {
          this.noScheduleExists = false
          this.toastr.success('schedule loaded')
        }
        this.spinner.hide()
        this.loaderText = ''
      })
      .catch(err => {
        this.spinner.hide()
        this.loaderText = ''
        this.toastr.error('error while getting schedule')
      });
  }

  DeleteSchedule(studentId: string, instructorId: string, time: string, date: string, message: string) {
    this.spinner.show()
    this.loaderText = 'deleting schedule'
    let collectionName = 'schedule' + date
    this.scheduleService.deleteSchedule(collectionName, studentId).then(data => {
      this.sendNotificationToInstructor(instructorId, time, date, message)
      this.sendNotificationToStudent(studentId, time, date, message)
      this.getAssignedScheduleAccToDate()
    }).catch(err => {
      this.spinner.hide()
      this.loaderText = ''
      this.toastr.error('error while deleting')
    })
  }

  sendNotificationToStudent(studentId: string, time: string, date: string, message: string) {
    this.spinner.show()
    this.loaderText = 'sending notification'
    this.scheduleService.sendNotificationsToStudent(studentId, time, date, message).then(data => {
      this.spinner.hide()
      this.loaderText = ''
      this.toastr.success('notification sent to student')
    }).catch(err => {
      this.spinner.hide()
      this.loaderText = ''
      this.toastr.success('error while sending notification')
    })
  }
  
  sendNotificationToInstructor(instructorIdId: string, time: string, date: string, message: string) {
    this.scheduleService.sendNotificationsToInstructor(instructorIdId, time, date, message).then(data => {
      this.spinner.hide()
      this.loaderText = ''
      this.toastr.success('notification sent to instructor')
    }).catch(err => {
      this.spinner.hide()
      this.loaderText = ''
      this.toastr.success('error while sending notification')
    })

  }

}
