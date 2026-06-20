export type EmployeeStatus = "Active" | "Inactive" | "On Leave"

export interface Employee {
  id: string
  profileImage: string 
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  designation: string
  joiningDate: string
  salary: number
  status: EmployeeStatus
  attendancePercentage: number
  address: string
  isFavorite?: boolean
}