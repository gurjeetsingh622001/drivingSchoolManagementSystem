import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http'
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NavComponent } from './admin/admin-layout/nav/nav.component';
import { AdminDashboardComponent } from './admin/admin-layout/admin-dashboard/admin-dashboard.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { RegisterStudentComponent } from './components/register-student/register-student.component';
import { RegisterInstructorComponent } from './components/register-instructor/register-instructor.component';
import { AdminStudentsComponent } from './admin/admin-students/admin-students.component';
import { TableModule } from 'primeng/table';
import { EditStudentComponent } from './admin/edit-student/edit-student.component';
import { AdminInstructorsComponent } from './admin/admin-instructors/admin-instructors.component';
import { EditInstructorComponent } from './admin/edit-instructor/edit-instructor.component';
import { CreateScheduleComponent } from './admin/create-schedule/create-schedule.component';
import { InstructorComponent } from './instructor/instructor.component';
import { InstructorNavComponent } from './instructor/instructor-nav/instructor-nav.component';
import { InstructorDashboardComponent } from './instructor/instructor-dashboard/instructor-dashboard.component';
import { UpcomingSchdulesComponent } from './instructor/upcoming-schdules/upcoming-schdules.component';
import { StudentProgressComponent } from './instructor/student-progress/student-progress.component';
import { StepsModule } from 'primeng/steps';
import { CreateSchedule1Component } from './admin/create-schedule1/create-schedule1.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { ManageSchedulesComponent } from './admin/manage-schedules/manage-schedules.component';
import { EditScheduleComponent } from './admin/edit-schedule/edit-schedule.component';
import { NotificationsComponent } from './instructor/notifications/notifications.component';
import { StudentComponent } from './student/student.component';
import { DashboardComponent } from './student/dashboard/dashboard.component';
import { StudenNavComponent } from './student/studen-nav/studen-nav.component';
import { ClassesComponent } from './student/classes/classes.component';
import { ProgressComponent } from './student/progress/progress.component';
import { StudentNotificationComponent } from './student/student-notification/student-notification.component';
import { AddFeedbackComponent } from './instructor/add-feedback/add-feedback.component';
import { StudentFeedbacksComponent } from './student/student-feedbacks/student-feedbacks.component';
@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    NavComponent,
    AdminDashboardComponent,
    AdminLayoutComponent,
    RegisterStudentComponent,
    RegisterInstructorComponent,
    AdminStudentsComponent,
    EditStudentComponent,
    AdminInstructorsComponent,
    EditInstructorComponent,
    CreateScheduleComponent,
    InstructorComponent,
    InstructorNavComponent,
    InstructorDashboardComponent,
    UpcomingSchdulesComponent,
    StudentProgressComponent,
    CreateSchedule1Component,
    ManageSchedulesComponent,
    EditScheduleComponent,
    NotificationsComponent,
    StudentComponent,
    DashboardComponent,
    StudenNavComponent,
    ClassesComponent,
    ProgressComponent,
    StudentNotificationComponent,
    AddFeedbackComponent,
    StudentFeedbacksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule.forRoot(),
    ReactiveFormsModule,
    TableModule,
    StepsModule,
    AutocompleteLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
