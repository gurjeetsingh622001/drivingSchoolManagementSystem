import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { initializeApp } from "firebase/app";
import { addDoc, arrayUnion, collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";
import { Observable, from, scheduled } from 'rxjs';
import { AuthPayload, AuthResponse, Instructor, Schedule, Student, User } from './model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);
  api = `https://identitytoolkit.googleapis.com/v1/accounts`;

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }

  async checkCurrentDateScheduleExists(collectionName: string) {
    // console.log(collectionName)
    try {
      const querySnapshot = await getDocs(collection(this.db, collectionName));
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking collection existence:', error);
      return false;
    }
  }

  async findInstructorAccordingToStudentVehicleType(VehicleType: string) {
    const q = query(collection(this.db, "users"), where("role", "==", 'instructor'), where("VehicleTypeExpertise", '==', VehicleType),);
    try {
      const querySnapshot = await getDocs(q);
      const students: Instructor[] = []
      querySnapshot.forEach((doc) => {
        students.push(doc.data() as Instructor)
      });
      return students as Instructor[];
    }
    catch (e) {
      return e
    }
  }

  createSchedule(collectionName: string, schedule: Schedule) {
    // console.log(collectionName);
    // console.log(schedule.student.userId);
    // console.log(typeof schedule.student.userId);
    const collectionRef = doc(this.db, collectionName, schedule.student.userId);
    const docRef = setDoc(collectionRef, schedule);
    return docRef;
  }
  async EditSchedule(collectionName: string, schedule: any, userId: string) {
    // console.log(collectionName)
    // console.log(schedule)
    // console.log(userId)
    try {
      const docRef = doc(this.db, collectionName, userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        schedule.docRef = docRef;
        await updateDoc(docRef, schedule);
        this.toastr.success('schedule successfully updated!');
      } else {
        this.toastr.error('No such schedule exists');
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      this.toastr.error('An error occurred while updating schedule');
    }
  }
  async deleteSchedule(collectionName: string, userId: string): Promise<void> {
    // console.log(collectionName)
    // console.log(userId)
    try {
      const docRef = doc(this.db, collectionName, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await deleteDoc(docRef);
        this.toastr.success("schedule successfully deleted!");
      } else {
        this.toastr.success("No such schedule exists. Nothing to delete.");
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      // You can handle the error as needed, e.g., displaying an error message.
    }
  }
  async getAllStudentsIfTodaysScheduleNotExists(collectionName: string) {
    // console.log(collectionName)
    const scheduleCollectionRef = collection(this.db, collectionName);
    const scheduleQuery = query(scheduleCollectionRef);

    // Step 3: Extract the userId from each document in the schedule collection
    const userIdsInSchedule: string[] = [];
    const scheduleQuerySnapshot = await getDocs(scheduleQuery);
    scheduleQuerySnapshot.forEach((doc) => {
      const studentId = doc.get('student.userId'); // Adjust the field path if needed
      userIdsInSchedule.push(studentId);
    });
    // console.log(userIdsInSchedule) // Adjust the field path if needed

    // Step 4: Query the users collection to find students not in the schedule
    const usersCollectionRef = collection(this.db, 'users');
    const usersQuery = query(usersCollectionRef, where('role', '==', 'student'));
    const studentsNotInSchedule: any = [];

    const usersQuerySnapshot = await getDocs(usersQuery);
    usersQuerySnapshot.forEach((doc) => {
      const userId = doc.get('userId'); // Adjust the field path if needed
      if (!userIdsInSchedule.includes(userId)) {
        studentsNotInSchedule.push(doc.data());
      }
    });
    // console.log(studentsNotInSchedule);
    return studentsNotInSchedule;

  }
  async getAvailableInstructors(date: string, time: string, CollectionName: string, VehicleTypeExpertise: string) {
    const instructorsRef = collection(this.db, 'users');
    const instructorsQuery = query(
      instructorsRef,
      where('role', '==', 'instructor'),
      where('VehicleTypeExpertise', '==', VehicleTypeExpertise)
    );
    const totalInstructorsWithEqualExpertise: Instructor[] = []
    let InstructorsInScheduleDocument: Schedule[] = []
    try {
      const querySnapshot = await getDocs(instructorsQuery);
      querySnapshot.forEach((doc) => {
        totalInstructorsWithEqualExpertise.push(doc.data() as Instructor)
      });

      InstructorsInScheduleDocument = await this.checkInstructorIsAvailable(CollectionName) as Schedule[];
      // console.log(totalInstructorsWithEqualExpertise)
      // console.log(InstructorsInScheduleDocument)

      const instructorsScheduledForTime = [...new Set(
        InstructorsInScheduleDocument
          .filter((schedule: Schedule) => schedule.time === time)
          .map((schedule: Schedule) => schedule.instructor.userId)
      )];

      const instructorsNotScheduledForTime = totalInstructorsWithEqualExpertise.filter(
        (instructor: Instructor) => !instructorsScheduledForTime.includes(instructor.userId)
      );
      // console.log(instructorsNotScheduledForTime)
      return instructorsNotScheduledForTime as Instructor[]

    }
    catch (e) {
      return e
    }
  }
  async checkInstructorIsAvailable(collectionName: string) {
    const q = query(collection(this.db, collectionName),
      where("instructor.role", "==", 'instructor'),
    );
    try {
      const Schedules: Schedule[] = []
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        Schedules.push(doc.data() as Schedule)
      });
      return Schedules as Schedule[]
    }
    catch (e) {
      return e
    }
  }
  async checkIfStudentPassedAnyCourse(studentId: string): Promise<any> {
    const StudentRef = doc(this.db, 'users', studentId);
    const docSnap = await getDoc(StudentRef);
    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      // docSnap.data() will be undefined in this case
      // console.log("No such document!");
    }
  }
  // manage schedule service
  async getAssignedScheduleAccToDate(CollectionName: string) {
    // console.log(CollectionName)
    const coll = collection(this.db, CollectionName);
    const instructorsQuery = query(coll);
    const curentAssignedClassesForToday: Schedule[] = []
    try {
      const querySnapshot = await getDocs(instructorsQuery);
      querySnapshot.forEach((doc) => {
        curentAssignedClassesForToday.push(doc.data() as Schedule)
        // console.log(doc.data())
      });
      // console.log(curentAssignedClassesForToday)
      return curentAssignedClassesForToday
    }
    catch (e) {
      this.toastr.error('error while getting schedule')
      return e
    }
  }


  async getScheduleById(collectionName: string, userId: string) {
    try {
      const docRef = doc(this.db, collectionName, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        return docSnap.data();
      } else {
        // console.log("No such document!");
        return null;
      }
    } catch (error) {
      // console.error("Error fetching document:", error);
      throw error; // Re-throw the error for the caller to handle
    }
  }

  async sendNotificationsToStudent(refId: string, time: string, date: string, message: string) {
    try {
      const form = {
        userId: refId,
        date: date,
        classTime: time,
        message: message
      }
      // console.log(form)
      const ref = doc(this.db, 'studentNotifications', refId);
      const docSnapshot = await getDoc(ref);
      if (docSnapshot.exists()) {
        await updateDoc(ref, {
          notifications: arrayUnion(form)
        });
      } else {
        await setDoc(ref, {
          notifications: [form]
        });
      }

      return 'Notification added successfully';
    } catch (error) {
      // console.error('Error adding notification:', error);
      throw error; // Rethrow the error to handle it further up the call stack if needed
    }
  }

  async sendNotificationsToInstructor(refId: string, time: string, date: string, message: string) {
    try {
      const form = {
        userId: refId,
        date: date,
        classTime: time,
        message: message
      }
      // console.log(form)
      const ref = doc(this.db, 'instructorNotifications', refId);
      const docSnapshot = await getDoc(ref);
      if (docSnapshot.exists()) {
        await updateDoc(ref, {
          notifications: arrayUnion(form)
        });
      } else {
        await setDoc(ref, {
          notifications: [form]
        });
      }
      return 'Notification added successfully';
    } catch (error) {
      // console.error('Error adding notification:', error);
      throw error; // Rethrow the error to handle it further up the call stack if needed
    }
  }







}


