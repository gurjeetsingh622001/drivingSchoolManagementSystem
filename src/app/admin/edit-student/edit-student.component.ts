import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { catchError, switchMap } from 'rxjs';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { AuthPayload, AuthResponse, Student } from 'src/app/shared/model';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {

  loaderText = ''
  studentForm: FormGroup;
  showSpinner: boolean = false;
  userId: string;

  constructor(private toastr: ToastrService, private router: Router, private apiService: ApiServiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute,) {
    this.studentForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z]+([ \-'][a-zA-Z]+)*$/)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^(?:\+91|0)?[6789]\d{9}$/)]),
      preferredVehicleType: new FormControl('car'),
      role: new FormControl('student'),
      returnSecureToken: new FormControl(true),
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id']
    })
    this.getInstructor();
  }

  Edit() {
    const userDetails: Student = {
      name: this.studentForm.value.name,
      email: this.studentForm.value.email,
      phone: this.studentForm.value.phoneNumber,
      role: this.studentForm.value.role,
      preferredVehicleType: this.studentForm.value.preferredVehicleType,
      userId: this.userId
    }
    if (this.studentForm.status === 'INVALID') {
      return this.studentForm.markAllAsTouched();
    }
    else {
      this.spinner.show()
      this.loaderText = 'Loading ...'

      this.apiService.updateStudentById(this.userId, userDetails).then(data => {
        this.toastr.success('student edited succesfully')
        this.router.navigate(['/admin/students'])
        this.spinner.hide()
        this.loaderText = ''
      }).catch(err => {
        console.log(err)
        this.toastr.error('something went wrong')
        this.spinner.hide()
        this.loaderText = ''
        // throw new Error(err)
      })

    }
  }

 

  get get() {
    return this.studentForm.controls
  }

  getInstructor() {
    this.spinner.show();
    this.loaderText = 'loading student details'
    this.apiService.getStudentById(this.userId).then(data => {
      if (data !== null) {
        console.log(data)
        this.studentForm.patchValue({
          name: data['name'],
          phoneNumber: data['phone'],
          preferredVehicleType: data['preferredVehicleType'],
          email: data['email'],
        })
      }
      this.spinner.hide();
      this.loaderText = ''
    }).catch(err => {
      this.spinner.hide();
      this.loaderText = ''
      this.toastr.error('error while getting student details')
    })
  }



}
