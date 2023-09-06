import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { Instructor } from 'src/app/shared/model';

@Component({
  selector: 'app-edit-instructor',
  templateUrl: './edit-instructor.component.html',
  styleUrls: ['./edit-instructor.component.css']
})
export class EditInstructorComponent implements OnInit {

  loaderText = '';
  instructorForm: FormGroup;
  showSpinner: boolean = false;
  userId: string;
  constructor(private toastr: ToastrService, private router: Router, private apiService: ApiServiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute) {
    this.instructorForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z]+([ \-'][a-zA-Z]+)*$/)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^(?:\+91|0)?[6789]\d{9}$/)]),
      VehicleTypeExpertise: new FormControl(''),
      role: new FormControl('instructor'),
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id']
    })
    this.getInstructor()
  }

  Edit() {
    const userDetails: Instructor = {
      name: this.instructorForm.value.name,
      email: this.instructorForm.value.email,
      phone: this.instructorForm.value.phoneNumber,
      role: this.instructorForm.value.role,
      VehicleTypeExpertise: this.instructorForm.value.VehicleTypeExpertise,
      userId: this.userId
    }
    if (this.instructorForm.status === 'INVALID') {
      return this.instructorForm.markAllAsTouched();
    }
    else {
      this.spinner.show();
      this.loaderText = 'Loading ...'
      this.apiService.updateInstructorById(this.userId, userDetails).then(data => {
        this.toastr.success('student edited succesfully')
        this.router.navigate(['/admin/instructors'])
        this.spinner.hide();
        this.loaderText = ''
      }).catch(err => {
        // console.log(err)
        this.toastr.error('something went wrong')
        this.spinner.hide();
        this.loaderText = ''
        throw new Error(err)
      })

    }
  }




  get get() {
    return this.instructorForm.controls
  }

  getInstructor() {
    this.spinner.show();
    this.loaderText = 'loading instructor details'
    this.apiService.getInstructorById(this.userId).then((data: any) => {
      if (data !== null) {
        // console.log(data)
        this.instructorForm.patchValue({
          name: data['name'],
          phoneNumber: data['phone'],
          VehicleTypeExpertise: data['VehicleTypeExpertise'],
          email: data['email'],
        })

      }
      this.spinner.hide();
      this.loaderText = ''
    }).catch(err => {
      console.log(err)
      this.spinner.hide();
      this.loaderText = ''
      this.toastr.error('error while getting details')
    })
  }

}
