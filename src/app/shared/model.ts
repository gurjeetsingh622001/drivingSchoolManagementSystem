export interface User {
    name: string;
    email: string;
    phone: number;
    userId: string;
}
export interface AuthPayload {
    email: string;
    password: string;
    returnSecureToken: boolean
}
export interface AuthResponse {
    email: string;
    expiresIn: string;
    idToken: string;
    Kind: string;
    localId: string;
    refreshToken: string
}
export interface Student {
    name: string;
    email: string;
    phone: number;
    userId: string;
    role: string;
    preferredVehicleType: string;
    passedCourses?: string[]
}
export interface Instructor {
    name: string;
    email: string;
    phone: number;
    userId: string;
    role: string;
    VehicleTypeExpertise: string;
}
export interface Schedule {
    date: string
    time: string,
    student: Student,
    instructor: Instructor,
    courseType?: string,
    classStatus?: string
}
export interface Notification {
    createdAt?: string;
    classTime: string;
    date: string;
    message: string;
    userId: string
}
export interface Feedback {
    createdAt?: string;
    studentName: string,
    phone: string,
    instructorName: string,
    feedback: string,
    vehicleType: string,
    courseType: string
}


