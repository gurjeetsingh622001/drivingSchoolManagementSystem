import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { initializeApp } from "firebase/app";
import { collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";
import { Observable, from } from 'rxjs';
import { AuthPayload, AuthResponse, Student, User } from './model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);
  api = `https://identitytoolkit.googleapis.com/v1/accounts`;

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }

  userRegister(form: AuthPayload): Observable<AuthResponse> {
    // console.log(form)
    return this.http.post<AuthResponse>(this.api + `:signUp?key=${environment.firebaseConfig.apiKey}`, form)
  }

  addUser(form: User) {
    // console.log(form)
    const ref = doc(this.db, 'users', form.userId);
    return setDoc(ref, form);
  }

  userLogin(form: any) {
    // console.log(form)
    return this.http.post(this.api + `:signInWithPassword?key=${environment.firebaseConfig.apiKey}`, form)
  }

  async checkUserRole(userId: string) {
    // console.log(userId)
    const docRef = doc(this.db, "users", userId);
    try {
      const docSnap = await getDoc(docRef);
      return docSnap.data()
    } catch (e) {
      return e
    }
  }

  async checkNumberOfStudents() {
    const coll = collection(this.db, "users");
    const q = query(coll, where("role", "==", "student"));
    try {
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count;
    }
    catch (e) {
      return e
    }
  }
  async checkNumberOfInstructor() {
    const coll = collection(this.db, "users");
    const q = query(coll, where("role", "==", "instructor"));
    try {
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count;
    }
    catch (e) {
      return e
    }
  }
  async getStudents() {
    const q = query(collection(this.db, "users"), where("role", "==", 'student'));
    try {
      const querySnapshot = await getDocs(q);
      const students: Student[] = []
      querySnapshot.forEach((doc) => {
        students.push(doc.data() as Student)
      });
      return students as Student[];
    }
    catch (e) {
      return e
    }
  }
  async getStudentById(userId: string) {
    try {
      const docRef = doc(this.db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        return docSnap.data();
      } else {
        // console.log("No such document!");
        return null;
      }
    } catch (error) {
      // console.error("Error fetching student details", error);
      throw error; // Re-throw the error for the caller to handle
    }
  }
  async updateStudentById(userId: string, form: any) {
    try {
      const docRef = doc(this.db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        form.docRef = docRef;
        await updateDoc(docRef, form);
        this.toastr.success('student details updated!');
      } else {
        this.toastr.error('student not exits');
      }
    } catch (error) {
      // console.error("Error updating student details:", error);
      this.toastr.error('An error occurred while updating the student.');
    }
  }

  async deleteStudent(userId: string): Promise<void> {
    try {
      const docRef = doc(this.db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await deleteDoc(docRef);
        // console.log("Document successfully deleted!");
      } else {
        // console.log("No such document exists. Nothing to delete.");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      // You can handle the error as needed, e.g., displaying an error message.
    }
  }

  async getInstructors() {
    const q = query(collection(this.db, "users"), where("role", "==", 'instructor'));
    try {
      const querySnapshot = await getDocs(q);
      const students: Student[] = []
      querySnapshot.forEach((doc) => {
        students.push(doc.data() as Student)
      });
      return students as Student[];
    }
    catch (e) {
      return e
    }
  }

  async getInstructorById(userId: string) {
    try {
      const docRef = doc(this.db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        return docSnap.data();
      } else {
        // console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching instructor details:", error);
      throw error; // Re-throw the error for the caller to handle
    }
  }

  async deleteInstructor(userId: string): Promise<void> {
    try {
      const docRef = doc(this.db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await deleteDoc(docRef);
        // console.log("Document successfully deleted!");
      } else {
        // console.log("No such document exists. Nothing to delete.");
      }
    } catch (error) {
      console.error("Error deleting instructor:", error);
      // You can handle the error as needed, e.g., displaying an error message.
    }
  }

  async updateInstructorById(userId: string, form: any) {
    // console.log(userId)
    // console.log(form)
    try {
      const docRef = doc(this.db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        form.docRef = docRef;
        await updateDoc(docRef, form);
        this.toastr.success('Instructor successfully updated!');
      } else {
        this.toastr.error('No such Instructor exists.');
      }
    } catch (error) {
      console.error("Error updating Instructor:", error);
      this.toastr.error('An error occurred while updating the Instructor.');
    }
  }

}
