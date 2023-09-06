import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { catchError, mergeMap, switchMap } from 'rxjs';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { AuthPayload, AuthResponse, Instructor, Student } from 'src/app/shared/model';

@Component({
  selector: 'app-register-instructor',
  templateUrl: './register-instructor.component.html',
  styleUrls: ['./register-instructor.component.css']
})
export class RegisterInstructorComponent implements OnInit {

  instructorForm: FormGroup;
  constructor(private toastr: ToastrService, private router: Router, private apiService: ApiServiceService, private spinner: NgxSpinnerService) {
    this.instructorForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s-']+$/)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^(?:\+91|0)?[6789]\d{9}$/)]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).+$/), Validators.minLength(6), Validators.maxLength(50)]),
      confirmPassword: new FormControl('', [Validators.required, this.confirmPass()]),
      VehicleTypeExpertise: new FormControl('scooty'),
      role: new FormControl('instructor'),
      returnSecureToken: new FormControl(true),
    })
  }
  ngOnInit(): void {

  }
  register() {
    const user: AuthPayload = {
      email: this.instructorForm.value.email,
      password: this.instructorForm.value.password,
      returnSecureToken: true
    }
    const userDetails: Instructor = {
      name: this.instructorForm.value.name,
      email: this.instructorForm.value.email,
      phone: this.instructorForm.value.phoneNumber,
      role: this.instructorForm.value.role,
      VehicleTypeExpertise: this.instructorForm.value.VehicleTypeExpertise,
      userId: ''
    }
    if (this.instructorForm.status === 'INVALID') {
      return this.instructorForm.markAllAsTouched();
    }
    else {
      this.spinner.show()
      this.apiService.userRegister(user).pipe(
        catchError(err => {
          this.toastr.error(err.error.error.message)
          throw new Error('something went wrong')
        }),
        switchMap(async (res: AuthResponse) => {
          userDetails.userId = await res.localId;
          return this.apiService.addUser(userDetails);
        })
      ).subscribe({
        next: (res: any) => {
          this.toastr.success('instructor registerd successfully')
          this.router.navigateByUrl('login')
          this.spinner.hide()
        },
        error: (err: any) => {
          this.toastr.error('something went wrong')
          this.spinner.hide()
          throw new Error(err)
        }

      })
    }
  }

  confirmPass(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      let password = this.instructorForm?.controls['password']?.value
      let confirmPassword = this.instructorForm?.controls['confirmPassword']?.value
      if (password === confirmPassword) {
        return null
      }
      else {
        return { 'confirmPassword': true }
      }
    }
  }

  get get() {
    return this.instructorForm.controls
  }

}
