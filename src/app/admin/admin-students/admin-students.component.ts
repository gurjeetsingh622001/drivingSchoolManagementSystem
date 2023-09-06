import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { Student } from 'src/app/shared/model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-students',
  templateUrl: './admin-students.component.html',
  styleUrls: ['./admin-students.component.css']
})
export class AdminStudentsComponent implements OnInit {

  products = []
  students: Student[] = []
  keyword = 'name';
  data = [];
  cols: any;
  form: FormGroup;
  tenantId: number;
  constructor(private apiService: ApiServiceService, private spinner: NgxSpinnerService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.getStudents();
  }


  getStudents() {
    this.spinner.show()
    this.apiService.getStudents().then((data: any) => {
      this.students = data;
      this.spinner.hide()
    }).catch(err => {
      this.spinner.hide()
      this.toastr.success('some thing went wrong')
      this.router.navigate(['/admin/dashboard'])
      console.log(err)
    })
  }

  delete(userId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show()
        this.apiService.deleteStudent(userId).then(async customerDelted => {
          console.log(customerDelted)
          await this.getStudents()
          this.spinner.hide()
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        })
          .catch(err => {
            console.log(err)
            this.spinner.hide()
            this.toastr.error(err)
          })

      }
    })
  }



}
