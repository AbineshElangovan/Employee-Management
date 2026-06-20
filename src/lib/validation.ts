import { z } from "zod"

export const employeeSchema = z.object({
  firstName: z.string().min(3, "First Name must contain at least 3 characters"),
  lastName: z.string().min(3, "Last Name must contain at least 3 characters"),
  email: z.string().email("Invalid email address layout sequence"),
  phone: z.string().min(10, "Phone number must be minimum 10 digits"),
  address: z.string().min(1, "Address is required"),
  employeeId: z.string().min(1, "Employee ID required"),
  department: z.string().min(1, "Department required"),
  designation: z.string().min(1, "Designation required"),
  joiningDate: z.string().min(1, "Joining date required"),
  salary: z.coerce.number().gt(0, "Salary parameter metric must be greater than 0"),
  status: z.enum(["Active", "Inactive", "On Leave"]),
  profileImage: z.string().min(1, "Profile image required"),
  attendancePercentage: z.coerce.number().min(0).max(100).default(0)
})

export type EmployeeFormData = z.infer<typeof employeeSchema>