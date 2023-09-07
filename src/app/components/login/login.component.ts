import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/shared/api-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private toastr: ToastrService, private router: Router, private apiService: ApiServiceService, private spinner: NgxSpinnerService) {
    this.loginForm = new FormGroup({
      email: new FormControl('admin@gmail.com', [Validators.required]),
      password: new FormControl('Test@123', [Validators.required])
    })
  }

  ngOnInit(): void {
    this.checkLocalStorage()
  }


  get get() {
    return this.loginForm.controls;
  }

  login() {
    if (this.loginForm.status === 'INVALID') {
      return this.loginForm.markAllAsTouched();
    }
    else {
      this.spinner.show();
      const user = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        returnSecureToken: true
      }
      this.apiService.userLogin(user).subscribe({
        next: (res: any) => {
          localStorage.setItem('user', JSON.stringify(res))
          this.checkRole(res.localId)
        },
        error: (err: any) => {
          // console.log(err)
          this.toastr.error('error', err.error.error.message)
          this.spinner.hide()
        }
      })
    }
  }

  checkRole(userId: string) {
    this.spinner.show()
    this.apiService.checkUserRole(userId).then((user: any) => {
      // console.log(user)
      localStorage.setItem('userRole', user.role)
      if (user.role === 'admin') {
        this.router.navigateByUrl('admin/dashboard')
      }
      if (user.role === 'student') {
        // console.log(user.role, 'role')
        this.router.navigateByUrl('student/progress')
      }
      if (user.role === 'instructor') {
        // console.log(user.role, 'role')
        this.router.navigateByUrl('instructor/dashboard')
      }
      this.spinner.hide()
    }).catch(err => {
      this.router.navigate(['login'])
      this.spinner.hide()
    })
  }


  async checkLocalStorage() {
    const user = await localStorage.getItem('user');
    const userRole = await localStorage.getItem('userRole');
    if (user !== null && userRole === 'admin') {
      this.router.navigateByUrl('admin/dashboard')
    }
    if (user !== null && userRole === 'instructor') {
      this.router.navigateByUrl('instructor/dashboard')
    }
    if (user !== null && userRole === 'student') {
      this.router.navigateByUrl('student/progress')
    }

  }

}
