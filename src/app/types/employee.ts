import type { EmployeeFormValues } from "@/src/schemas/employee.schema"


// =======================
// Employee Types
// =======================

export type Employee = EmployeeFormValues & {
  id: string
  createdAt: string
  updatedAt: string
}

export type EmployeeFormData = EmployeeFormValues


// =======================
// Auth Types
// =======================

export type User = {
  id: string
  name: string
  email: string
}

export type LoginData = {
  email: string
  password: string
}

export type SignupData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export type ForgotPasswordData = {
  email: string
}


// =======================
// Department Types
// =======================

export type Department = {
  id?: string
  department: string
  employeeCount: number
  headName?: string | null
}


// =======================
// Attendance Types
// =======================

export type AttendanceStatus =
  | "Present"
  | "Absent"
  | "Loss of pay"
  | "Half Day"


export type AttendanceRecord = {
  id?: string
  employeeId: string
  employeeName?: string
  date: string
  status: AttendanceStatus
  checkIn?: string | null
  checkOut?: string | null
}


// =======================
// Dashboard Types
// =======================

export type DashboardData = {
  totalEmployees: number
  activeEmployees: number
  inactiveEmployees: number
  onLeaveEmployees: number
  totalDepartments: number
  avgAttendance: number

  departments: {
    department: string
    count: number
  }[]

  recentEmployees: Employee[]
}


// =======================
// API Response Types
// =======================

export type ApiResponse<T> = {
  data?: T
  error?: string
  message?: string
}


// =======================
// Pagination Types
// =======================

export type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}