import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { collection } from 'firebase/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { Instructor, Schedule, Student } from 'src/app/shared/model';
import { ScheduleService } from 'src/app/shared/schedule.service';

@Component({
  selector: 'app-edit-schedule',
  templateUrl: './edit-schedule.component.html',
  styleUrls: ['./edit-schedule.component.css']
})
export class EditScheduleComponent implements OnInit {

  loaderText = ''
  keyword = 'name';
  instructorkeyword = 'name'
  scheduleForm: FormGroup;
  students: Student[] = [];
  instructors: Instructor[] = [];
  selectedStudent: Student;
  selectedInstructor: Instructor;
  instructorId: string;
  collectionName: string;
  noInstructorIsAvailableAtThisTime: boolean = false;
  allStudentsAssignedToInstructorForToday: boolean = false;
  allInstructorsAssignedForToday: boolean = false;
  ScheduleToEdit: Schedule;

  timeNotficationMessageForStudent: string = '';
  instructorNotficationMessageForStudent: string = '';
  currentScheduleTime: string = '';
  currentScheduleInstructor: string = '';

  showAllCourseToUser: boolean = false

  upcomingCourses: string[] = []
  courses = ['course 1', 'course 2', 'course 3', 'course 4', 'course 5'];
  showAllCourses: boolean = false;

  constructor(private scheduleService: ScheduleService, private spinner: NgxSpinnerService, private apiService: ApiServiceService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router) {
    this.scheduleForm = new FormGroup({
      date: new FormControl('', Validators.required),
      time: new FormControl('', Validators.required),
      instructorId: new FormControl('', Validators.required),
      studentId: new FormControl('', Validators.required),
      courseType: new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe((parmas: any) => {
      this.getScheduleById(parmas)
    })

    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationStart) {
    //     console.log(this.router.url)
    //   }
    // });
  }

  //step one
  getScheduleById(params: any) {
    this.spinner.show()
    this.loaderText = 'Loading schedule data'
    const CollectionName = 'schedule' + params.date;
    const userId = params.userId
    this.scheduleService.getScheduleById(CollectionName, userId).then((data: any) => {
      this.ScheduleToEdit = data
      this.patchValues(data)
    }).catch(err => {
      this.spinner.hide()
      this.loaderText = ''
    })
  }
  patchValues(schedule: Schedule) {
    this.scheduleForm.patchValue({
      date: schedule.date,
      time: schedule.time,
      instructorId: schedule.instructor.name,
      studentId: schedule.student.name,
      courseType: schedule.courseType
    })
    this.currentScheduleTime = schedule.time;
    this.currentScheduleInstructor = schedule.instructor.userId;
    this.findAvailableInstructors();
    this.checkIfStudentPassedAnyCourse(schedule.student);
  }

  //step two
  findAvailableInstructors() {
    this.spinner.show()
    this.loaderText = 'finding available instructors'
    if (this.currentScheduleTime !== this.scheduleForm.value.time) {
      this.timeNotficationMessageForStudent = ''
      this.timeNotficationMessageForStudent += 'class time changed'
    } else {
      this.timeNotficationMessageForStudent = ''
    }
    this.scheduleForm.patchValue({
      instructorId: '',
      courseType: ''
    })
    const time = this.scheduleForm.value.time;
    const date = this.scheduleForm.value.date;
    const collectionName = 'schedule' + date;
    const VehicleTypeExpertise = this.ScheduleToEdit.student.preferredVehicleType;
    this.instructors = [];
    this.scheduleService.getAvailableInstructors(date, time, collectionName, VehicleTypeExpertise).then((data: any) => {
      this.instructors = data;
      if (this.instructors.length === 0) {
        this.allInstructorsAssignedForToday = true
        this.instructors = [];
      } else {
        this.allInstructorsAssignedForToday = false
      }
      this.spinner.hide()
      this.loaderText = ''
    }).catch(err => {
      this.spinner.hide()
      this.loaderText = ''
      this.toastr.error('something went wrong')
    })
  }

  checkIfStudentPassedAnyCourse(student: any) {
    const passedCourses = student.passedCourses
    if (student.passedCourses?.length === 0) {
      this.upcomingCourses = this.courses
    } else {
      this.upcomingCourses = this.courses.filter(course => !passedCourses.includes(course));
    }
  }

  // step three
  getInstructorById(event: any) {
    this.spinner.show()
    this.loaderText = 'Loading instructor details'
    this.apiService.getInstructorById(event.userId).then((data: any) => {
      if (data !== null) {
        this.selectedInstructor = data
      }
      this.spinner.hide()
      this.loaderText = ''
    }).catch(err => {
      this.spinner.hide()
      this.loaderText = ''
      this.toastr.error('error while getting instructor details')
    })
  }

  // step edit schedule
  EditSchedule() {
    this.spinner.show()
    this.loaderText = 'Editing schedule ...'
    const date = this.scheduleForm.value.date;
    const collectionName = 'schedule' + date;
    this.instructorNotficationMessageForStudent = ''
    this.instructorNotficationMessageForStudent += 'Instructor changed'
    const schedule: Schedule = {
      date: this.scheduleForm.value.date,
      time: this.scheduleForm.value.time,
      instructor: this.selectedInstructor,
      student: this.ScheduleToEdit.student,
      courseType: this.scheduleForm.value.courseType,
      classStatus: this.ScheduleToEdit.classStatus,
    }
    this.scheduleService.EditSchedule(collectionName, schedule, this.ScheduleToEdit.student.userId).then(data => {
      this.toastr.success('schedule is edited')
      this.sendNotificationToInstructor()
      this.sendNotificationToStudent()
    }).catch(err => {
      this.spinner.hide()
      this.loaderText = ''
      this.toastr.success('error while editing schedule')
    })
  }

  // step last sending notification while editing and deleting schedule

  sendNotificationToStudent() {
    this.loaderText = 'sending notification'
    const date = this.scheduleForm.value.date;
    const collectionName = 'schedule' + date;
    const schedule: Schedule = {
      date: this.scheduleForm.value.date,
      time: this.scheduleForm.value.time,
      instructor: this.selectedInstructor,
      student: this.ScheduleToEdit.student,
      courseType: this.scheduleForm.value.courseType,
      classStatus: this.ScheduleToEdit.classStatus,
    }
    const message = this.timeNotficationMessageForStudent + '     ' + this.instructorNotficationMessageForStudent
    this.scheduleService.sendNotificationsToStudent(schedule.student.userId, schedule.time, schedule.date, message).then(data => {
      this.spinner.hide()
      this.loaderText = ''
      this.toastr.success('notification sent to student')
    }).catch(err => {
      this.spinner.hide()
      this.loaderText = ''
      this.toastr.success('error while sending notification')
    })
  }
  sendNotificationToInstructor() {
    this.spinner.show()
    this.loaderText = 'sending notification'
    const date = this.scheduleForm.value.date;
    const collectionName = 'schedule' + date;
    const schedule: Schedule = {
      date: this.scheduleForm.value.date,
      time: this.scheduleForm.value.time,
      instructor: this.selectedInstructor,
      student: this.ScheduleToEdit.student,
      courseType: this.scheduleForm.value.courseType,
      classStatus: this.ScheduleToEdit.classStatus,
    }
    const message = this.timeNotficationMessageForStudent + '     ' + this.instructorNotficationMessageForStudent
    this.scheduleService.sendNotificationsToInstructor(schedule.instructor.userId, schedule.time, schedule.date, message).then(data => {
      this.spinner.hide()
      this.loaderText = ''
      this.toastr.success('notification sent to instructor')
    }).catch(err => {
      this.spinner.hide()
      this.loaderText = ''
      this.toastr.success('error while sending notification')
    })

  }

  /////////////////////

 

  get get() {
    return this.scheduleForm.controls;
  }



}
