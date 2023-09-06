import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { catchError, mergeMap, switchMap } from 'rxjs';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { AuthPayload, AuthResponse, Student, User } from 'src/app/shared/model';

@Component({
  selector: 'app-register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.css']
})
export class RegisterStudentComponent implements OnInit {

  studentForm: FormGroup;
  constructor(private toastr: ToastrService, private router: Router, private apiService: ApiServiceService, private spinner: NgxSpinnerService) {
    this.studentForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s-']+$/)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^(?:\+91|0)?[6789]\d{9}$/)]),
      preferredVehicleType: new FormControl('car'),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).+$/), Validators.minLength(6), Validators.maxLength(50)]),
      confirmPassword: new FormControl('', [Validators.required, this.confirmPass()]),
      role: new FormControl('student'),
      returnSecureToken: new FormControl(true),
    })
  }

  ngOnInit(): void {
  }

  register() {
    const user: AuthPayload = {
      email: this.studentForm.value.email,
      password: this.studentForm.value.password,
      returnSecureToken: true
    }
    const userDetails: Student = {
      name: this.studentForm.value.name,
      email: this.studentForm.value.email,
      phone: this.studentForm.value.phoneNumber,
      role: this.studentForm.value.role,
      preferredVehicleType: this.studentForm.value.preferredVehicleType,
      userId: '',
      passedCourses: ['']
    }
    if (this.studentForm.status === 'INVALID') {
      return this.studentForm.markAllAsTouched();
    }
    else {
      this.spinner.show()
      this.apiService.userRegister(user).pipe(
        catchError(err => {
          // console.log(err)
          this.toastr.error(err.error.error.message)
          throw new Error('something went wrong')
        }),
        switchMap((res: AuthResponse) => {
          // console.log(res)
          userDetails.userId = res.localId;
          return this.apiService.addUser(userDetails);
        }),
      ).subscribe({
        next: (res: any) => {
          this.toastr.success('student registerd successfully')
          this.router.navigateByUrl('login')
          this.spinner.hide()
        },
        error: (err: any) => {
          // console.log(err)
          this.toastr.error('something went wrong')
          this.spinner.hide()
          throw new Error(err)
        }

      })
    }
  }


  confirmPass(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      let password = this.studentForm?.controls['password']?.value
      let confirmPassword = this.studentForm?.controls['confirmPassword']?.value
      if (password === confirmPassword) {
        return null
      }
      else {
        return { 'confirmPassword': true }
      }
    }
  }

  get get() {
    return this.studentForm.controls
  }


}
