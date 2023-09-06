import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { collection } from 'firebase/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { Instructor, Schedule, Student } from 'src/app/shared/model';
import { ScheduleService } from 'src/app/shared/schedule.service';

@Component({
  selector: 'app-create-schedule1',
  templateUrl: './create-schedule1.component.html',
  styleUrls: ['./create-schedule1.component.css']
})
export class CreateSchedule1Component implements OnInit {

  activeIndex = 0;
  steps: any[] = [
    { label: 'Date of Schedule' },
    { label: 'Student' },
    { label: 'Time' },
    { label: 'Instructor' },
    { label: 'Course' },
  ];

  scheduleForm: FormGroup;
  students: Student[] = [];
  instructors: Instructor[] = [];
  selectedStudent: Student;
  selectedInstructor: Instructor;
  instructorId: string;
  collectionName: string;
  noInstructorIsAvailableAtThisTime: boolean = false;
  allStudentsAssignedToInstructorForToday: boolean = false;


  DateForm: FormGroup;
  StudentNameForm: FormGroup;

  constructor(private scheduleService: ScheduleService, private spinner: NgxSpinnerService, private apiService: ApiServiceService, private toastr: ToastrService) {
    this.scheduleForm = new FormGroup({
      date: new FormControl(''),
      time: new FormControl(''),
      student: new FormControl(),
      instructor: new FormControl(''),
      studentName: new FormControl(''),
      studentLevel: new FormControl(''),
      courseType: new FormControl('')
    })

    this.DateForm = new FormGroup({
      date: new FormControl(''),
    })

    this.StudentNameForm = new FormGroup({
      student: new FormControl(''),
    })

  }



  ngOnInit(): void {
    // this.getStudentsToAssignInstructorForToday()
    // this.getInstructorsToAssignToAStudentForToday()
  }

  handleStepChange(event: any) {
    this.activeIndex = event.index;
  }

  onSubmit() {
    // Handle form submission here, e.g., send the data to the server
    const formData = this.scheduleForm.value;
    console.log(formData);
  }

  DateChangeFunction(event: any) {
    console.log(event.target.value)
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

  createSchedule() {
    const date = this.scheduleForm.value.date;
    const collectionName = 'schedule' + date;
    const schedule: Schedule = {
      date: this.scheduleForm.value.date,
      time: this.scheduleForm.value.time,
      instructor: this.selectedInstructor,
      student: this.selectedStudent,
      courseType: this.scheduleForm.value.courseType
    }
    console.log(schedule)
    console.log(this.scheduleForm.value)
    console.log(this.instructorId)
    console.log(this.instructors)
    this.scheduleService.createSchedule(collectionName, schedule).then(data => {
      this.toastr.success('schedule is created')
    }).catch(err => {
      this.toastr.success('something went wrong')

    })
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
      this.spinner.hide()
    }).catch(err => {
      this.spinner.hide()
      this.toastr.success('some thing went wrong')
      console.log(err)
    })

  }
  getAvailableStudentsForTodaysSchedule() {

  }
  getInstructorsToAssignToAStudentForToday() {

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
  findInstructorAccordingToStudentVehicleType(event: any) {
    console.log(event.target.value)
    this.spinner.show()
    let VehicleType: string | undefined;
    console.log(this.scheduleForm.value.time)
    if (this.scheduleForm.value.time) {
      this.findAvailableInstructors()
    }
    this.apiService.getStudentById(event.target.value).then((data: any) => {
      if (data !== null) {
        this.spinner.hide()
        console.log(data.preferredVehicleType)
        this.selectedStudent = data;
        console.log(this.selectedStudent)
        VehicleType = data.preferredVehicleType;
        this.getInstructorAccordingly(VehicleType)
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
  getInstructorById(event: any) {
    console.log(event.target.value)
    console.log('get instructor by id is hitting')
    this.apiService.getInstructorById(event.target.value).then((data: any) => {
      if (data !== null) {
        console.log(data)
        // this.instructorForm.patchValue({
        //   name: data['name'],
        //   phoneNumber: data['phone'],
        //   VehicleTypeExpertise: data['VehicleTypeExpertise'],
        //   email: data['email'],
        // })
        this.selectedInstructor = data
      }
    }).catch(err => {
      console.log(err)
      this.toastr.error('error while getting details')
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
  findAvailableInstructors() {
    const time = this.scheduleForm.value.time;
    const date = this.scheduleForm.value.date;
    const collectionName = 'schedule' + date;
    const VehicleTypeExpertise = this.selectedStudent.preferredVehicleType;
    console.log(this.selectedStudent.preferredVehicleType)
    console.log(this.instructors)
    this.instructors = [];
    console.log(this.instructors)
    this.scheduleService.getAvailableInstructors(date, time, collectionName, VehicleTypeExpertise).then((data: any) => {
      if (data.length === 0) {
        console.log('if hiting')
        this.noInstructorIsAvailableAtThisTime = true
        this.instructors = [];
      } else {
        console.log('else hiting')
        this.instructors = data;
        this.noInstructorIsAvailableAtThisTime = false
      }
      console.log(data)
    }).catch(err => {
      console.log(err)
    })
  }


}
