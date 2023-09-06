import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { InstructorService } from 'src/app/shared/instructor.service';
import { Schedule, Student } from 'src/app/shared/model';

@Component({
  selector: 'app-instructor-dashboard',
  templateUrl: './instructor-dashboard.component.html',
  styleUrls: ['./instructor-dashboard.component.css']
})
export class InstructorDashboardComponent implements OnInit {

  zeroClassesAssigned: boolean = false;
  loaderText = '';
  schedules: Schedule[]

  constructor(private instructorService: InstructorService, private toastr: ToastrService, private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    this.getCurentAssignedClassesForToday()
  }

  async getCurentAssignedClassesForToday() {
    this.spinner.show()
    this.loaderText = 'Loading classes'
    let currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const collectionName = `schedule${year}-${month}-${day}`;

    const instructor = await localStorage.getItem('user');
    let instructorId = '';

    if (instructor !== null) {
      instructorId = JSON.parse(instructor).localId;
    }

    this.instructorService.getCurentAssignedClassesForToday(collectionName, instructorId)
      .then((data: any) => {
        this.schedules = data
        this.spinner.hide();
        this.loaderText = ''
        this.toastr.success('loaded')
        if (this.schedules.length === 0) {
          this.zeroClassesAssigned = true;
        } else {
          this.zeroClassesAssigned = false;
        }
      })
      .catch(err => {
        this.spinner.hide();
        this.loaderText = ''
        this.toastr.error('error while getting data')
        // console.log(err);
      });
  }

  passStudent(student: Student, studentId: string, passedCourse: string, passedCourses: string[], schedule: Schedule, date: string, currentClassStatus?: string) {
    // console.log(student)
    // console.log(studentId)
    // add course to student doc 
    this.addPassedCourseToStudentDetail(student, studentId, passedCourse, passedCourses, currentClassStatus);
    this.changeClassStatusInSchedule(schedule, studentId, 'passed', date, currentClassStatus)
  }

  addPassedCourseToStudentDetail(student: Student, studentId: string, passedCourse: string, passedCourses: string[], currentClassStatus?: string) {
    this.spinner.show()
    this.loaderText = 'Loading'
    // console.log(currentClassStatus)
    if (currentClassStatus === 'failed' || currentClassStatus === 'passed') {
      this.toastr.success('class status can change only once')
      this.spinner.hide()
      this.loaderText = ''
      return;
    }
    this.instructorService.addPassedCourseToStudentDetail(student, studentId, passedCourse, passedCourses).then((data: any) => {
      this.spinner.hide()
      this.loaderText = ''
      // console.log(data)
      this.ngOnInit()
    }).catch(err => {
      this.spinner.hide()
      this.loaderText = ''
      // console.log(err)
      this.toastr.error('something went wrong')
    })
  }

  changeClassStatusInSchedule(schedule: Schedule, studentId: string, classStatus: string, date: string, currentClassStatus?: string) {
    // console.log(currentClassStatus)
    this.spinner.show()
    this.loaderText = 'Loading'
    if (currentClassStatus === 'failed' || currentClassStatus === 'passed') {
      this.toastr.success('class status can change only once')
      this.spinner.hide()
      this.loaderText = ''
      return;
    }
    this.instructorService.changeClassStatusInSchedule(schedule, studentId, classStatus, date).then((data: any) => {
      this.spinner.hide()
      this.loaderText = ''
      // console.log(data)
      this.ngOnInit()
    }).catch(err => {
      this.spinner.hide()
      this.loaderText = ''
      // console.log(err)
      this.toastr.error('something went wrong')
    })
  }


}



