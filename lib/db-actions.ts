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

export async function getEmployees(): Promise<Employee[]> {
  const employees = db.prepare(`
    SELECT * FROM employees ORDER BY createdAt DESC
  `).all() as Employee[]
  return employees
}

export async function getEmployee(id: string): Promise<Employee | null> {
  const employee = db.prepare(`
    SELECT * FROM employees WHERE id = ?
  `).get(id) as Employee | undefined
  return employee || null
}

export async function createEmployee(data: Omit<Employee, "id" | "createdAt" | "updatedAt">) {
  try {
    const id = nanoid()
    db.prepare(`
      INSERT INTO employees (
        id, employeeId, firstName, lastName, email, phone, department,
        designation, salary, status, attendancePercentage, address,
        joiningDate, imageUrl, createdAt, updatedAt
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(
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

    const newEmployee = db.prepare("SELECT * FROM employees WHERE id = ?").get(id) as Employee
    revalidatePath("/employees")
    return { success: true, data: { ...newEmployee } }
  } catch (error: any) {
    console.error("createEmployee error:", error)
    return { success: false, error: error.message }
  }
}

export async function updateEmployee(id: string, data: Partial<Employee>) {
  try {
    db.prepare(`
      UPDATE employees SET
        firstName = ?,
        lastName = ?,
        email = ?,
        phone = ?,
        department = ?,
        designation = ?,
        salary = ?,
        status = ?,
        attendancePercentage = ?,
        address = ?,
        joiningDate = ?,
        imageUrl = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.firstName,
      data.lastName,
      data.email,
      data.phone ?? null,
      data.department,
      data.designation ?? null,
      data.salary,
      data.status,
      data.attendancePercentage ?? 0,
      data.address,
      data.joiningDate,
      data.imageUrl ?? null,
      id
    )

    const updated = db.prepare("SELECT * FROM employees WHERE id = ?").get(id) as Employee
    revalidatePath("/employees")
    revalidatePath(`/employees/${id}/view`)
    return { success: true, data: { ...updated } }
  } catch (error: any) {
    console.error("updateEmployee error:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteEmployee(id: string) {
  try {
    db.prepare("DELETE FROM employees WHERE id = ?").run(id)
    revalidatePath("/employees")
    return { success: true }
  } catch (error: any) {
    console.error("deleteEmployee error:", error)
    return { success: false, error: error.message }
  }
}