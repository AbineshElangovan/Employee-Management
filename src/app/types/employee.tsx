export type EmployeeStatus = "Active" | "Inactive" | "On Leave"

export type Employee = {
  id: string
  Image: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  designation: string
  salary: number
  status: EmployeeStatus
  attendancePercentage: number
  address: string
  joiningDate: string  
   imageUrl?: string    
}

export type EmployeeFormData = Omit<Employee, "id">

export type Department = {
  id: string
  name: string
  email: string
  phone: string
  department: string
  salary: number
  address: string
  Image: string
  imageUrl?: string
}

export type AttendanceRecord = {
  employeeId: string
  name: string
  Image: string
  designation: string
  status: "Present" | "Absent" | "Loss of pay" | "Half Day"
  attendancePercentage: number
}

export type DashboardData = {
  totalEmployees: number
  activeEmployees: number
  inactiveEmployees: number
  onLeaveEmployees: number
  totalDepartments: number
  avgAttendance: number
  departments: { department: string; count: number }[]
  recentEmployees: Employee[]
}





