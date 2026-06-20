import { z } from "zod"

export const DEPARTMENTS = [
  "Development",
  "Sales",
  "HR",
  "Marketing",
  "Finance",
  "Design",
  "IT",
  "Cyber Security",
] as const

export const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  on_leave: "On Leave",
}

export const STATUS_BADGE_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  inactive: "destructive",
  on_leave: "secondary",
}

export const employeeFormSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  firstName: z.string().min(3, "First Name must contain at least 3 characters"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be exactly 10 digits")
    .max(10, "Phone number must be exactly 10 digits"),
  address: z.string().min(5, "Home Address is required"),
  department: z.string().min(1, "Department is required"),
  designation: z.string().optional(),
  joiningDate: z.string().min(1, "Joining date is required"),
  salary: z.coerce.number().gt(0, "Salary must be greater than 0"),
  status: z.enum(["active", "inactive", "on_leave"]),
  imageUrl: z.string().optional(),
  attendancePercentage: z.coerce.number().min(0).max(100).default(0),
})

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>


export type EmployeeFormData = EmployeeFormValues