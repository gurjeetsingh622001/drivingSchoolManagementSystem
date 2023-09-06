import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { InstructorService } from 'src/app/shared/instructor.service';
import { Schedule, Student } from 'src/app/shared/model';

@Component({
  selector: 'app-upcoming-schdules',
  templateUrl: './upcoming-schdules.component.html',
  styleUrls: ['./upcoming-schdules.component.css']
})
export class UpcomingSchdulesComponent implements OnInit {

  noScheduleExists: boolean = false;
  date: string;
  schedules: Schedule[];
  loaderText = ''
  constructor(private route: ActivatedRoute, private instructorService: InstructorService, private toastr: ToastrService,private spinner : NgxSpinnerService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.date = params.date;
      // console.log(params)
      this.getCurentAssignedClassesForToday();
    })

  }

  async getCurentAssignedClassesForToday() {
    // console.log('hitted')
    this.spinner.show()
    this.loaderText = 'loading ...'
    const collectionName = `schedule${this.date}`;
    // console.log(collectionName)
    const instructor = await localStorage.getItem('user');
    let instructorId = '';
    if (instructor !== null) {
      instructorId = JSON.parse(instructor).localId;
    }
    this.instructorService.getCurentAssignedClassesForToday(collectionName, instructorId)
      .then((data: any) => {
        // console.log(data)
        this.schedules = data
        if (this.schedules.length === 0) {
          this.noScheduleExists = true
          this.toastr.success('no classes assigned')
        } else {
          this.noScheduleExists = false
          this.toastr.success('loaded')
        }
        this.spinner.hide()
        this.loaderText = ''
        
      })
      .catch(err => {
        this.toastr.error('error while getting data');
        this.spinner.hide()
        this.loaderText = ''
        // console.log(err);
      });
  }

  // passStudent(student: Student, studentId: string, passedCourse: string, passedCourses: string[], schedule: Schedule, date: string, currentClassStatus?: string) {
  //   console.log(student)
  //   console.log(studentId)
  //   // add course to student doc 
  //   this.addPassedCourseToStudentDetail(student, studentId, passedCourse, passedCourses, currentClassStatus);
  //   this.changeClassStatusInSchedule(schedule, studentId, 'passed', date, currentClassStatus)
  // }

  // addPassedCourseToStudentDetail(student: Student, studentId: string, passedCourse: string, passedCourses: string[], currentClassStatus?: string) {

  //   // console.log(currentClassStatus)
  //   if (currentClassStatus === 'failed' || currentClassStatus === 'passed') {
  //     this.toastr.show('class status can change only once')
  //     return;
  //   }
  //   this.instructorService.addPassedCourseToStudentDetail(student, studentId, passedCourse, passedCourses).then((data: any) => {
  //     console.log(data)
  //     this.ngOnInit()
  //   }).catch(err => {
  //     console.log(err)
  //   })
  // }

  // changeClassStatusInSchedule(schedule: Schedule, studentId: string, classStatus: string, date: string, currentClassStatus?: string) {
  //   console.log(currentClassStatus)
  //   if (currentClassStatus === 'failed' || currentClassStatus === 'passed') {
  //     this.toastr.show('class status can change only once')
  //     return;
  //   }
  //   this.instructorService.changeClassStatusInSchedule(schedule, studentId, classStatus, date).then((data: any) => {
  //     console.log(data)
  //     this.ngOnInit()
  //   }).catch(err => {
  //     console.log(err)
  //   })
  // }



}
