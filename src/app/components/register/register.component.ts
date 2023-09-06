import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { catchError, mergeMap, switchMap, throwError } from 'rxjs';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { AuthPayload, AuthResponse, User } from 'src/app/shared/model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  formType: FormControl;
  adduserForm: FormGroup;

  constructor(private toastr: ToastrService, private router: Router, private apiService: ApiServiceService, private spinner: NgxSpinnerService) {

    this.adduserForm = new FormGroup({
      returnSecureToken: new FormControl(true),
      name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z]+([ \-'][a-zA-Z]+)*$/)]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^(?:\+91|0)?[6789]\d{9}$/)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).+$/), Validators.minLength(6), Validators.maxLength(50)]),
      confirm_pass: new FormControl('', [Validators.required, this.confirmPass()])
    })

    this.formType = new FormControl('student')

  }
  ngOnInit(): void {
  }

  register() {
    const user: AuthPayload = {
      email: this.adduserForm.value.email,
      password: this.adduserForm.value.password,
      returnSecureToken: true
    }
    const userDetails: User = {
      name: this.adduserForm.value.name,
      email: this.adduserForm.value.email,
      phone: this.adduserForm.value.phone,
      userId: ''
    }
    if (this.adduserForm.status === 'INVALID') {
      return this.adduserForm.markAllAsTouched();
    }
    else {
      this.spinner.show()
      this.apiService.userRegister(user).pipe(
        catchError(err => {
          throw new Error('something went wrong')
        }),
        switchMap((res: AuthResponse) => {
          userDetails.userId = res.localId;
          return this.apiService.addUser(userDetails);
        })
      ).pipe(
        mergeMap((data: any) => {
          return data
        })
      ).subscribe({
        next: (res: any) => {
          this.toastr.success('user registerd successfully')
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

  get get() {
    return this.adduserForm.controls
  }

  confirmPass(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      let password = this.adduserForm?.controls['password']?.value
      let confirm_pass = this.adduserForm?.controls['confirm_pass']?.value
      if (password === confirm_pass) {
        return null
      }
      else {
        return { 'confirmPassword': true }
      }
    }
  }

}
