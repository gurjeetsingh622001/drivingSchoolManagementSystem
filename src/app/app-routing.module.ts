import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './admin/admin-layout/admin-dashboard/admin-dashboard.component';
import { RegisterStudentComponent } from './components/register-student/register-student.component';
import { RegisterInstructorComponent } from './components/register-instructor/register-instructor.component';
import { Authguard } from './authguard.guard';
import { AdminStudentsComponent } from './admin/admin-students/admin-students.component';
import { EditStudentComponent } from './admin/edit-student/edit-student.component';
import { AdminInstructorsComponent } from './admin/admin-instructors/admin-instructors.component';
import { EditInstructorComponent } from './admin/edit-instructor/edit-instructor.component';
import { CreateScheduleComponent } from './admin/create-schedule/create-schedule.component';
import { InstructorComponent } from './instructor/instructor.component';
import { InstructorDashboardComponent } from './instructor/instructor-dashboard/instructor-dashboard.component';
import { UpcomingSchdulesComponent } from './instructor/upcoming-schdules/upcoming-schdules.component';
import { StudentProgressComponent } from './instructor/student-progress/student-progress.component';
import { ManageSchedulesComponent } from './admin/manage-schedules/manage-schedules.component';
import { EditScheduleComponent } from './admin/edit-schedule/edit-schedule.component';
import { NotificationsComponent } from './instructor/notifications/notifications.component';
import { StudentComponent } from './student/student.component';
import { DashboardComponent } from './student/dashboard/dashboard.component';
import { ProgressComponent } from './student/progress/progress.component';
import { ClassesComponent } from './student/classes/classes.component';
import { StudentNotificationComponent } from './student/student-notification/student-notification.component';
import { AddFeedbackComponent } from './instructor/add-feedback/add-feedback.component';
import { StudentFeedbacksComponent } from './student/student-feedbacks/student-feedbacks.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'register', component: RegisterComponent,
    children: [
      { path: 'register-student', component: RegisterStudentComponent },
      { path: 'register-instructor', component: RegisterInstructorComponent }
    ]
  },
  {
    path: 'admin', component: AdminLayoutComponent, canActivate: [Authguard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'students', component: AdminStudentsComponent },
      { path: 'edit-student/:id', component: EditStudentComponent },
      { path: 'instructors', component: AdminInstructorsComponent },
      { path: 'instructor-edit/:id', component: EditInstructorComponent },
      // { path: 'create-schedule', component: CreateScheduleComponent }
      { path: 'create-schedule', component: CreateScheduleComponent },
      { path: 'manage-schedule/:date', component: ManageSchedulesComponent },
      { path: 'edit-schedule/:date/:userId', component: EditScheduleComponent }
    ]
  },
  {
    path: 'instructor', component: InstructorComponent, canActivate: [Authguard],
    children: [
      { path: 'dashboard', component: InstructorDashboardComponent },
      { path: 'upcoming-schedules/:date', component: UpcomingSchdulesComponent },
      { path: 'student-progress/:studentId', component: StudentProgressComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'give-feedback', component: AddFeedbackComponent }
    ]
  },
  {
    path: 'student', component: StudentComponent, canActivate: [Authguard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'progress', component: ProgressComponent },
      { path: 'upcoming-classes', component: ClassesComponent },
      { path: 'notifications', component: StudentNotificationComponent },
      { path: 'feedbacks', component: StudentFeedbacksComponent }, 

    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
