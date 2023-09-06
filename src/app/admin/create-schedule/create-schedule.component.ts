import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { collection } from 'firebase/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { Instructor, Schedule, Student } from 'src/app/shared/model';
import { ScheduleService } from 'src/app/shared/schedule.service';

@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrls: ['./create-schedule.component.css']
})
export class CreateScheduleComponent implements OnInit {

  loaderText: string = ''
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

  showAllCourseToUser: boolean = false;

  upcomingCourses: string[] = []
  courses = ['course 1', 'course 2', 'course 3', 'course 4', 'course 5'];
  showAllCourses: boolean = false;

  minDate: string;
  maxDate: string;
  constructor(private scheduleService: ScheduleService, private spinner: NgxSpinnerService, private apiService: ApiServiceService, private toastr: ToastrService) {
    this.limitTheDatesOfCalender();
    this.scheduleForm = new FormGroup({
      date: new FormControl('', Validators.required),
      time: new FormControl('', Validators.required),
      instructorId: new FormControl('', Validators.required),
      studentId: new FormControl('', Validators.required),
      courseType: new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
  }

  // step 1
  limitTheDatesOfCalender() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 2);
    this.maxDate = maxDate.toISOString().split('T')[0];
    // console.log(this.minDate)
    // console.log(this.maxDate)
  }

  // formatDate(date: Date): string {
  //   const year = date.getFullYear();
  //   const month = (date.getMonth() + 1).toString().padStart(2, '0');
  //   const day = date.getDate().toString().padStart(2, '0');
  //   return `${year}-${month}-${day}`;
  // }



  // step two ----------
  DateChangeFunction(event: any) {
    // console.log(event.target.value)
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
    this.spinner.show()
    this.loaderText = 'students'
    const date = this.scheduleForm.value.date;
    const collection = 'schedule' + date;
    this.scheduleService.checkCurrentDateScheduleExists(collection).then(data => {
      // console.log(data)
      if (data === false) {
        // this.createSchedule()
        this.getAllStudentsIfTodaysScheduleNotExists();
        // this.getAllInstructorsToAssignToAStudentForToday()
      } else {
        this.getAllStudentsWhichAreNotScheduledToday(collection);
      }
    }).catch(err => {
      // console.log(err)
      this.toastr.error('error while loading students')
      this.ngOnInit()
    });
  }

  getAllStudentsIfTodaysScheduleNotExists() {
    this.apiService.getStudents().then((data: any) => {
      // console.log(data)
      this.students = data;
      if (this.students.length === 0) {
        this.allStudentsAssignedToInstructorForToday = true
        this.students = [];
      } else {
        this.allStudentsAssignedToInstructorForToday = false
        this.toastr.success('students loaded')
      }
      this.spinner.hide()
      this.loaderText = ''
    }).catch(err => {
      this.loaderText = ''
      this.spinner.hide()
      this.toastr.success('error while loading students')
      this.ngOnInit()
      // console.log(err)
    })

  }
  getAllStudentsWhichAreNotScheduledToday(collectionName: string) {
    this.scheduleService.getAllStudentsIfTodaysScheduleNotExists(collectionName).then(data => {
      // console.log(data)
      this.students = data;
      if (this.students.length === 0) {
        this.allStudentsAssignedToInstructorForToday = true
        this.students = [];
      } else {
        this.toastr.success('students loaded')
        this.allStudentsAssignedToInstructorForToday = false
      }
      this.spinner.hide()
      this.loaderText = ''
    }).catch(err => {
      this.toastr.success('erro while loading students')
      this.ngOnInit()
    });
  }

  // step four
  findInstructorAccordingToStudentVehicleType(student: any) {
    this.spinner.show()
    this.loaderText = 'instructors according student'
    this.scheduleForm.patchValue({
      time: '',
      instructorId: '',
      // studentLevel: '',
      courseType: ''
    })
    // finding passed courses by student usnig student id
    this.checkIfStudentPassedAnyCourse(student)
    // console.log(student)
    let VehicleType: string | undefined;
    // console.log(this.scheduleForm.value.time)
    if (this.scheduleForm.value.time) {
      this.findAvailableInstructors()
    }
    this.apiService.getStudentById(student.userId).then((data: any) => {
      if (data !== null) {
        this.spinner.hide()
        this.loaderText = ''
        // console.log(data.preferredVehicleType)
        this.selectedStudent = data;
        // console.log(this.selectedStudent)
        VehicleType = data.preferredVehicleType;
        // this.getInstructorAccordingly(VehicleType)
      }
      this.spinner.hide()
      this.loaderText = ''
    }).catch(err => {
      this.loaderText = ''
      this.spinner.hide()
      // console.log(err)
      this.toastr.error('something went wrong')
      this.ngOnInit()
    })

  }

  checkIfStudentPassedAnyCourse(student: any) {
    const passedCourses = student.passedCourses
    if (student.passedCourses?.length === 0) {
      this.upcomingCourses = this.courses
    } else {
      this.upcomingCourses = this.courses.filter(course => !passedCourses.includes(course));
      // console.log(this.upcomingCourses)
    }
  }

  // step five
  findAvailableInstructors() {
    this.spinner.show()
    this.loaderText = 'instructors'

    this.scheduleForm.patchValue({
      instructorId: '',
      courseType: ''
    })

    if (!this.scheduleForm.value.date) {
      this.toastr.success('please select a date');
      this.spinner.hide()
      this.loaderText = ''
      return;
    }
    if (!this.scheduleForm.value.studentId) {
      this.toastr.success('please select a student');
      this.spinner.hide()
      this.loaderText = ''
      return;
    }

    const time = this.scheduleForm.value.time;
    const date = this.scheduleForm.value.date;
    const collectionName = 'schedule' + date;
    const VehicleTypeExpertise = this.selectedStudent.preferredVehicleType;
    // console.log(this.selectedStudent.preferredVehicleType)
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
      // console.log('ddd')
      this.spinner.hide();
      this.loaderText = '';
      // console.log(data)
    }).catch(err => {
      this.spinner.hide();
      this.loaderText = '';
      this.toastr.error('error while getting instructors')
      this.ngOnInit()
      // console.log(err)
    })
  }

  // step six getting selected instructor details
  getInstructorById(event: any) {
    this.spinner.show()
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
        this.selectedInstructor = data;
      }
      this.spinner.hide()
    }).catch(err => {
      // console.log(err)
      this.spinner.hide()
      this.toastr.error('somethin went wrong')
    })
  }

  // final step seven create schedule
  createSchedule() {
    this.spinner.show()
    const date = this.scheduleForm.value.date;
    const collectionName = 'schedule' + date;
    const schedule: Schedule = {
      date: this.scheduleForm.value.date,
      time: this.scheduleForm.value.time,
      instructor: this.selectedInstructor,
      student: this.selectedStudent,
      courseType: this.scheduleForm.value.courseType,
      classStatus: "pending"
    }
    // console.log(schedule)
    // console.log(this.scheduleForm.value)
    // console.log(this.instructorId)
    // console.log(this.instructors)
    this.scheduleService.createSchedule(collectionName, schedule).then(data => {
      this.spinner.hide()
      this.toastr.success('schedule created succesfully')
      this.scheduleForm.reset()
    }).catch(err => {
      this.spinner.hide()
      this.toastr.success('error while creating schedule')
      this.ngOnInit()
    })
  }

  // getStudentsToAssignInstructorForToday() {
  //   const date = this.scheduleForm.value.date;
  //   const collection = 'schedule' + date;
  //   this.scheduleService.checkCurrentDateScheduleExists(collection).then(data => {
  //     if (data === false) {
  //       this.getAllStudentsIfTodaysScheduleNotExists();
  //       this.getAllInstructorsToAssignToAStudentForToday();
  //       return;
  //     } else {

  //     }
  //   }).catch(err => {
  //     console.log(err)
  //   })

  // }
  // getAllInstructorsToAssignToAStudentForToday() {
  //   this.spinner.show()
  //   this.apiService.getInstructors().then((data: any) => {
  //     this.instructors = data;
  //     this.spinner.hide()
  //   }).catch(err => {
  //     this.spinner.hide()
  //     this.toastr.success('some thing went wrong')
  //     console.log(err)
  //   })
  // }
  // getInstructorAccordingly(VehicleType: any) {
  //   this.instructors = []
  //   this.spinner.show()
  //   this.scheduleService.findInstructorAccordingToStudentVehicleType(VehicleType).then((data: any) => {
  //     this.instructors = data;
  //     this.spinner.hide()
  //     console.log(data)
  //   })
  //     .catch(err => {
  //       console.log(err)
  //     })
  // }
  get get() {
    return this.scheduleForm.controls;
  }



}
