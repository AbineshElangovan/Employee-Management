"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

export type Employee = {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  designation?: string | null
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
  const employees = await prisma.employee.findMany({
    orderBy: { createdAt: "desc" },
  })
  return employees.map(serializeEmployee)
}

export async function getEmployee(id: string): Promise<Employee | null> {
  const employee = await prisma.employee.findUnique({
    where: { id },
  })
  return employee ? serializeEmployee(employee) : null
}

export async function createEmployee(
  data: Omit<Employee, "id" | "createdAt" | "updatedAt">
) {
  try {
    const newEmployee = await prisma.employee.create({
      data: {
        employeeId: data.employeeId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        department: data.department,
        designation: data.designation || null,
        salary: data.salary,
        status: data.status,
        attendancePercentage: data.attendancePercentage ?? 0,
        address: data.address,
        joiningDate: new Date(data.joiningDate),
        imageUrl: data.imageUrl || null,
      },
    })

    revalidatePath("/employees")
    return { success: true, data: serializeEmployee(newEmployee) }
  } catch (error: any) {
    console.error("createEmployee error:", error)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const target = (error.meta?.target as string[])?.join(", ") || "field"
      return { success: false, error: `${target} already exists` }
    }
    return { success: false, error: error.message }
  }
}

export async function updateEmployee(id: string, data: Partial<Employee>) {
  try {
    const updated = await prisma.employee.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        department: data.department,
        designation: data.designation ?? null,
        salary: data.salary,
        status: data.status,
        attendancePercentage: data.attendancePercentage ?? 0,
        address: data.address,
        joiningDate: data.joiningDate ? new Date(data.joiningDate) : undefined,
        imageUrl: data.imageUrl ?? null,
      },
    })

    revalidatePath("/employees")
    revalidatePath(`/employees/${id}/view`)
    return { success: true, data: serializeEmployee(updated) }
  } catch (error: any) {
    console.error("updateEmployee error:", error)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const target = (error.meta?.target as string[])?.join(", ") || "field"
      return { success: false, error: `${target} already exists` }
    }
    return { success: false, error: error.message }
  }
}

export async function deleteEmployee(id: string) {
  try {
    await prisma.employee.delete({ where: { id } })
    revalidatePath("/employees")
    return { success: true }
  } catch (error: any) {
    console.error("deleteEmployee error:", error)
    return { success: false, error: error.message }
  }
}

function serializeEmployee(employee: any): Employee {
  return {
    ...employee,
    joiningDate: employee.joiningDate.toISOString(),
    createdAt: employee.createdAt?.toISOString(),
    updatedAt: employee.updatedAt?.toISOString(),
  }
}