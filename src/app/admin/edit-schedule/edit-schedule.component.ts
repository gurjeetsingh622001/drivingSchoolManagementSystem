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
      // studentLevel: new FormControl(''),
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe((parmas: any) => {
      // console.log(parmas)
      this.getScheduleById(parmas)
    })

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Store the previous route URL before navigation starts
        // this.previousUrl = router.url;
        console.log(this.router.url)
      }
    });
  }
  //step one
  getScheduleById(params: any) {
    console.log('hitting')
    this.spinner.show()
    this.loaderText = 'Loading schedule data'
    const CollectionName = 'schedule' + params.date;
    const userId = params.userId
    this.scheduleService.getScheduleById(CollectionName, userId).then((data: any) => {
      // console.log(data)
      this.ScheduleToEdit = data
      this.patchValues(data)
    }).catch(err => {
      console.log(err)
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
    // console.log(this.currentScheduleTime)
    // console.log(this.scheduleForm.value.time)
    if (this.currentScheduleTime !== this.scheduleForm.value.time) {
      this.timeNotficationMessageForStudent = ''
      this.timeNotficationMessageForStudent += 'class time changed'
      // console.log('class time changed')
    } else {
      // console.log('class time not changed')
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
    // console.log(VehicleTypeExpertise)
    // console.log(this.instructors)
    this.instructors = [];
    // console.log(this.instructors)
    this.scheduleService.getAvailableInstructors(date, time, collectionName, VehicleTypeExpertise).then((data: any) => {
      this.instructors = data;
      if (this.instructors.length === 0) {
        // console.log('if hits')
        this.allInstructorsAssignedForToday = true
        this.instructors = [];
      } else {
        // console.log('else hits')
        this.allInstructorsAssignedForToday = false
      }
      this.spinner.hide()
      this.loaderText = ''
      console.log(data)
    }).catch(err => {
      this.spinner.hide()
      this.loaderText = ''
      console.log(err)
      this.toastr.error('something went wrong')
    })
  }
  checkIfStudentPassedAnyCourse(student: any) {
    const passedCourses = student.passedCourses
    if (student.passedCourses?.length === 0) {
      this.upcomingCourses = this.courses
    } else {
      this.upcomingCourses = this.courses.filter(course => !passedCourses.includes(course));
      console.log(this.upcomingCourses)
    }
  }

  // step three
  getInstructorById(event: any) {
    this.spinner.show()
    this.loaderText = 'Loading instructor details'
    // console.log(event)
    // console.log('get instructor by id is hitting')
    this.apiService.getInstructorById(event.userId).then((data: any) => {
      if (data !== null) {
        // console.log(data)
        // this.instructorForm.patchValue({
        //   name: data['name'],
        //   phoneNumber: data['phone'],
        //   VehicleTypeExpertise: data['VehicleTypeExpertise'],
        //   email: data['email'],
        // })
        this.selectedInstructor = data
      }
      this.spinner.hide()
      this.loaderText = ''
    }).catch(err => {
      // console.log(err)
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
    // console.log(schedule)
    // console.log(this.ScheduleToEdit)
    // console.log(this.scheduleForm.value)
    // console.log(this.instructorId)
    // console.log(this.instructors)
    // console.log(this.timeNotficationMessageForStudent)
    // console.log(this.instructorNotficationMessageForStudent)

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
    const message = this.timeNotficationMessageForStudent + '' + this.instructorNotficationMessageForStudent
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
    const message = this.timeNotficationMessageForStudent + '' + this.instructorNotficationMessageForStudent
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

  DateChangeFunction(event: any) {
    console.log(event.target.value, 'event fired')
    this.scheduleForm.patchValue({
      time: '',
      instructorId: '',
      studentId: '',
      // studentLevel: '',
      courseType: ''
    })
    this.checkCurrentDateScheduleExists()
  }
  checkCurrentDateScheduleExists() {
    const date = this.scheduleForm.value.date;
    const collection = 'schedule' + date;
    this.scheduleService.checkCurrentDateScheduleExists(collection).then(data => {
      console.log(data)
      if (data === false) {
        // this.createSchedule()
        this.getAllStudentsIfTodaysScheduleNotExists();
        this.getAllInstructorsToAssignToAStudentForToday()
      } else {
        this.getAllStudentsWhichAreNotScheduledToday(collection);
      }
    }).catch(err => {
      console.log(err)
    });
  }
  getStudentsToAssignInstructorForToday() {
    const date = this.scheduleForm.value.date;
    const collection = 'schedule' + date;
    this.scheduleService.checkCurrentDateScheduleExists(collection).then(data => {
      if (data === false) {
        this.getAllStudentsIfTodaysScheduleNotExists();
        this.getAllInstructorsToAssignToAStudentForToday();
        return;
      } else {

      }
    }).catch(err => {
      console.log(err)
    })

  }
  getAllStudentsIfTodaysScheduleNotExists() {
    this.spinner.show()
    this.apiService.getStudents().then((data: any) => {
      console.log(data)
      this.students = data;
      if (this.students.length === 0) {
        this.allStudentsAssignedToInstructorForToday = true
        this.students = [];
      } else {
        this.allStudentsAssignedToInstructorForToday = false
      }
      this.spinner.hide()
    }).catch(err => {
      this.spinner.hide()
      this.toastr.success('some thing went wrong')
      console.log(err)
    })

  }
  getAllInstructorsToAssignToAStudentForToday() {
    this.spinner.show()
    this.apiService.getInstructors().then((data: any) => {
      this.instructors = data;
      this.spinner.hide()
    }).catch(err => {
      this.spinner.hide()
      this.toastr.success('some thing went wrong')
      console.log(err)
    })
  }
  findInstructorAccordingToStudentVehicleType(student: any) {

    this.scheduleForm.patchValue({
      time: '',
      instructorId: '',
      // studentLevel: '',
      courseType: ''
    })
    this.checkIfStudentPassedAnyCourse(student)
    console.log(student)
    this.spinner.show()
    let VehicleType: string | undefined;
    console.log(this.scheduleForm.value.time)
    if (this.scheduleForm.value.time) {
      this.findAvailableInstructors()
    }
    this.apiService.getStudentById(student.userId).then((data: any) => {
      if (data !== null) {
        this.spinner.hide()
        console.log(data.preferredVehicleType)
        this.selectedStudent = data;
        console.log(this.selectedStudent)
        VehicleType = data.preferredVehicleType;
        // this.getInstructorAccordingly(VehicleType)
      }
      this.spinner.hide()
    }).catch(err => {
      this.spinner.hide()
      console.log(err)
      this.toastr.error('error while getting details')
    })

  }
  getInstructorAccordingly(VehicleType: any) {
    this.instructors = []
    this.spinner.show()
    this.scheduleService.findInstructorAccordingToStudentVehicleType(VehicleType).then((data: any) => {
      this.instructors = data;
      this.spinner.hide()
      console.log(data)
    })
      .catch(err => {
        console.log(err)
      })
  }
  getAllStudentsWhichAreNotScheduledToday(collectionName: string) {
    this.scheduleService.getAllStudentsIfTodaysScheduleNotExists(collectionName).then(data => {
      console.log(data)
      this.students = data;
      if (this.students.length === 0) {
        this.allStudentsAssignedToInstructorForToday = true
        this.students = [];
      } else {
        this.allStudentsAssignedToInstructorForToday = false
      }
    }).catch(err => {
      this.toastr.error('some thing went wrong ')
    });
  }

  get get() {
    return this.scheduleForm.controls;
  }



}
