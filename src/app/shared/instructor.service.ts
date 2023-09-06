import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { initializeApp } from "firebase/app";
import { addDoc, arrayUnion, collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { Observable, from, scheduled } from 'rxjs';
import { AuthPayload, AuthResponse, Feedback, Instructor, Schedule, Student, User } from './model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);
  api = `https://identitytoolkit.googleapis.com/v1/accounts`;

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }

  async getCurentAssignedClassesForToday(CollectionName: string, instructorId: string) {
    const coll = collection(this.db, CollectionName);
    const instructorsQuery = query(
      coll,
      where('instructor.userId', '==', instructorId),
    );
    const curentAssignedClassesForToday: Schedule[] = []
    try {
      const querySnapshot = await getDocs(instructorsQuery);
      querySnapshot.forEach((doc) => {
        curentAssignedClassesForToday.push(doc.data() as Schedule)
      });
      return curentAssignedClassesForToday
    }
    catch (e) {
      return e
    }
  }

  // student service 
  async addPassedCourseToStudentDetail(student: any, studentId: string, passedCourse: string, passedCourses: string[]) {
    const docRef = doc(this.db, "users", studentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const studentToUpdate = student;
      let resultPassedCourse: string[] = []
      for (let c of passedCourses) {
        if (c !== '') {
          resultPassedCourse.push(c)
        }
      }
      resultPassedCourse.push(passedCourse)
      studentToUpdate.passedCourses = resultPassedCourse
      studentToUpdate.docRef = docRef;
      await updateDoc(docRef, student);
      this.toastr.success('passed course successfully added!');
    } else {
      this.toastr.error('error while loading student passed courses');
    }
  }

  async changeClassStatusInSchedule(schedule: any, studentId: string, classStatus: string, date: string) {
    const docRef = doc(this.db, 'schedule' + date, studentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const scheduleToUpdate = schedule;
      scheduleToUpdate.classStatus = classStatus
      scheduleToUpdate.docRef = docRef;
      await updateDoc(docRef, scheduleToUpdate);
      this.toastr.success('class status successfully updated!');
    } else {
      this.toastr.error('error while updating class status');
    }
  }

  async getInstructorNotifications(instructorId: string) {
    let notifications: Notification[] = []
    try {
      const docRef = doc(this.db, "instructorNotifications", instructorId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        notifications = docSnap.data() as Notification[]
        return notifications;
      } else {
        return 'no data exists'
      }
    } catch (error) {
      throw error;
    }
  }

  async getUpcomingClassByDateAndStudentId(date: string, studentId: string) {
    try {
      const docRef = doc(this.db, "schedule" + date, studentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      throw error;  
    }
  }

  async getStudentProgressDetails(StudentId: string) {
    try {
      const docRef = doc(this.db, "users", StudentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      // console.error("Error fetching student progress:", error);
      throw error; 
    }
  }

  // 
  async giveFeedbackToStudent(refId: string, feedback: Feedback) {
    try {
      const ref = doc(this.db, 'studentFeedbacks', refId);
      const docSnapshot = await getDoc(ref);
      if (docSnapshot.exists()) {
        await updateDoc(ref, {
          feedbacks: arrayUnion(feedback)
        });
      } else {
        await setDoc(ref, {
          feedbacks: [feedback]
        });
      }
      this.toastr.success('feedback succesfully submitted')
      return 'feedback succesfully submitted';
    } catch (error) {
      // console.error('Error adding feedback:', error);
      throw error;
    }
  }


}
