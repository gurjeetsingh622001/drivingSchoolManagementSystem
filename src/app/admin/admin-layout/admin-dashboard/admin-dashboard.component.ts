import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/shared/api-service.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  LoaderText = ''
  showInstructors: boolean = false;
  showStudents: boolean = false;
  studentCount: number;
  instructorCount: number;
  constructor(private apiService: ApiServiceService, private toatsr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.checkNumberOfStudents();
    this.checkNumberOfInstructor()
  }

  checkNumberOfStudents() {
    this.spinner.show()
    this.LoaderText = 'Loading ...'
    this.apiService.checkNumberOfStudents().then((studentCount: any) => {
      this.studentCount = studentCount;
      setTimeout(() => {
        this.LoaderText = ''
        this.spinner.hide()
        this.showStudents = true;
      }, 2000)
    })
      .catch(err => {
        this.LoaderText = ''
        this.toatsr.error('something went wrong')
        this.spinner.hide()
      })
  }

  checkNumberOfInstructor() {
    this.spinner.show()
    this.LoaderText = 'Loading ...'
    this.apiService.checkNumberOfInstructor().then((instructorCount: any) => {
      this.instructorCount = instructorCount;
      setTimeout(() => {
        this.showInstructors = true;
        this.LoaderText = ''
        this.spinner.hide()
      }, 2000)
    }).catch(err => {
      this.LoaderText = ''
      this.toatsr.error('something went wrong')
      this.spinner.hide()
    })
  }

}
