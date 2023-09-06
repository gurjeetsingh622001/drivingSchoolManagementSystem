import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService, Spinner } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { InstructorService } from 'src/app/shared/instructor.service';
import { Student } from 'src/app/shared/model';

@Component({
  selector: 'app-add-feedback',
  templateUrl: './add-feedback.component.html',
  styleUrls: ['./add-feedback.component.css']
})
export class AddFeedbackComponent implements OnInit {

  loaderText = '';
  studentId: string;
  instructorName: string;
  courseType: string
  feedBackForm: FormGroup;

  constructor(private instructorService: InstructorService, private route: ActivatedRoute, private apiService: ApiServiceService, private spinner: NgxSpinnerService, private toastr: ToastrService, private router: Router) {
    this.feedBackForm = new FormGroup({
      studentName: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      instructorName: new FormControl('', Validators.required),
      feedback: new FormControl('', Validators.required),
      vehicleType: new FormControl('', Validators.required),
      courseType: new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((data: any) => {
      this.studentId = data.studentId,
        this.instructorName = data.instructorName,
        this.courseType = data.courseType
    })
    this.getStudent();
  }


  getStudent() {
    this.spinner.show()
    this.loaderText = 'loading'
    this.apiService.getStudentById(this.studentId).then((data: any) => {
      // console.log(data)
      this.patchData(data)
    }).catch(err => {
      this.toastr.error('error while getting student details')
      this.spinner.hide()
      this.loaderText = ''
      // console.log(err)
    })
  }

  patchData(student: Student) {
    this.feedBackForm.patchValue({
      studentName: student.name,
      phone: student.phone,
      vehicleType: student.preferredVehicleType,
      instructorName: this.instructorName,
      courseType: this.courseType
    })
    this.spinner.hide()
    this.loaderText = ''
  }

  submitFeedback() {
    this.spinner.show()
    this.loaderText = 'loading'
    this.instructorService.giveFeedbackToStudent(this.studentId, this.feedBackForm.value).then(data => {
      // console.log(data)
      this.toastr.success('submitted feedback')
      this.spinner.hide()
      this.loaderText = ''
      this.router.navigateByUrl('instructor/dashboard')
    }).catch(err => {
      this.toastr.error('error while submitting feedback')
      this.spinner.hide()
      this.loaderText = ''
      // console.log(err)
    })
  }


}
