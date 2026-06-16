"use server"

import db from "@/lib/db"
import { revalidatePath } from "next/cache"
import { nanoid } from "nanoid"

export type Employee = {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  designation?: string
  salary: number
  status: "active" | "inactive" | "on_leave"
  attendancePercentage?: number
  address: string
  joiningDate: string
  imageUrl?: string | null
  createdAt?: string
  updatedAt?: string
}

export async function getEmployees() {
  const employees = db.prepare(`
    SELECT * FROM employees ORDER BY createdAt DESC
  `).all() as Employee[]
  return employees
}

export async function createEmployee(data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const id = nanoid()
    const stmt = db.prepare(`
      INSERT INTO employees (
        id, employeeId, firstName, lastName, email, phone, department,
        designation, salary, status, attendancePercentage, address,
        joiningDate, imageUrl, createdAt, updatedAt
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `)

    stmt.run(
      id,
      data.employeeId,
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.department,
      data.designation || null,
      data.salary,
      data.status,
      data.attendancePercentage || 0,
      data.address,
      data.joiningDate,
      data.imageUrl || null
    )

    const newEmployee = db.prepare('SELECT * FROM employees WHERE id =?').get(id) as Employee
    revalidatePath('/employees')
    return { success: true, data: newEmployee }
  } catch (error: any) {
    console.error("Server Action createEmployee Error:", error)
    return { success: false, error: error.message }
  }
}