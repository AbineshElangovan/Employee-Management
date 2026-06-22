import { z } from "zod"

export const employeeFormSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  department: z.string().min(1, "Select a department"),
  designation: z.string().optional(),
  salary: z.coerce.number().positive("Salary must be greater than 0"),
  status: z.enum(["active", "inactive", "on_leave"]),
  attendancePercentage: z.coerce.number().min(0).max(100).optional(),
  address: z.string().min(1, "Address is required"),
  joiningDate: z.string().min(1, "Joining date is required"),
  imageUrl: z.string().optional(),
})

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>

export const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Human Resources",    
  "Finance",
  "Operations",
  "Customer Support",
] as const

export const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  on_leave: "On leave",
}

export const STATUS_BADGE_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  inactive: "outline",
  on_leave: "secondary",
}