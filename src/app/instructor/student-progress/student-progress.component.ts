import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { InstructorService } from 'src/app/shared/instructor.service';

@Component({
  selector: 'app-student-progress',
  templateUrl: './student-progress.component.html',
  styleUrls: ['./student-progress.component.css']
})
export class StudentProgressComponent implements OnInit {

  loaderText = '';
  courses = [];
  studentId: string;
  showProgress: boolean = false
  constructor(private instructorService: InstructorService, private route: ActivatedRoute, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.route.params.subscribe((data: any) => {
      this.studentId = data.studentId
    })
    this.getStudentProgress();
  }

  getResult(coursType: string) {
    const result = this.courses.find((obj: string) => {
      return coursType === obj
    })
    if (result) {
      return 'completed'
    }
    return 'Not completed'
  }

  getStudentProgress() {
    this.spinner.show();
    this.loaderText = 'loading student progress'
    this.instructorService.getStudentProgressDetails(this.studentId).then((data: any) => {
      this.spinner.hide()
      this.loaderText = ''
      this.courses = data.passedCourses;
      this.showProgress = true
    }).catch(err => {
      this.showProgress = false;
      this.toastr.success('error while getting progress details')
      this.spinner.hide()
      this.loaderText = ''
    })
  }


}
