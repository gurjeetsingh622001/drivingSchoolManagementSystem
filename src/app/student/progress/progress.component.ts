import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { InstructorService } from 'src/app/shared/instructor.service';
import { Student } from 'src/app/shared/model';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {

  courses = [];
  studentId: string;
  loaderText = '';
  showProgress: boolean = false;
  progress: string = '';
  constructor(private instructorService: InstructorService, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getStudentId();
    this.getStudentProgress();
  }


  getStudentProgress() {
    this.spinner.show();
    this.loaderText = 'loading your course progress'
    this.instructorService.getStudentProgressDetails(this.studentId).then((data: any) => {
      this.courses = data.passedCourses
      this.toastr.success('loaded')
      this.progress = this.getPercentage(this.courses.length)
      this.spinner.hide()
      this.loaderText = ''
      this.showProgress = true;
    }).catch(err => {
      this.showProgress = false;
      this.toastr.success('error while getting your progress')
      this.spinner.hide()
      this.loaderText = ''
    })
  }

  getStudentId() {
    const user = localStorage.getItem('user')
    if (user) {
      this.studentId = JSON.parse(user).localId
    }
  }

  getResult(coursType: string) {
    const result = this.courses.find((obj: string) => {
      return coursType === obj;
    })
    if (result) {
      return 'completed'
    }
    return 'Not completed'
  }

  getPercentage(value: number): string {
    switch (value) {
      case 0:
        return '0%';
      case 1:
        return '20%';
      case 2:
        return '40%';
      case 3:
        return '60%'
      case 4:
        return '80%';
      case 5:
        return '100%';
      default:
        return 'not data'
    }
  }
}
