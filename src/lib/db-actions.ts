"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

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
  const employees = await prisma.employee.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return employees.map((emp) => ({
    ...emp,
    joiningDate: emp.joiningDate.toISOString(),
    createdAt: emp.createdAt.toISOString(),
    updatedAt: emp.updatedAt.toISOString(),
  }))
}

export async function getEmployee(id: string): Promise<Employee | null> {
  const employee = await prisma.employee.findUnique({
    where: { id },
  })

  if (!employee) return null

  return {
    ...employee,
    joiningDate: employee.joiningDate.toISOString(),
    createdAt: employee.createdAt.toISOString(),
    updatedAt: employee.updatedAt.toISOString(),
  }
}

export async function createEmployee(
  data: Omit<Employee, "id" | "createdAt" | "updatedAt">
) {
  try {
    const employee = await prisma.employee.create({
      data: {
        employeeId: data.employeeId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        department: data.department,
        designation: data.designation,
        salary: data.salary,
        status: data.status,
        attendancePercentage: data.attendancePercentage ?? 0,
        address: data.address,
        joiningDate: new Date(data.joiningDate),
        imageUrl: data.imageUrl,
      },
    })

    revalidatePath("/employees")

    return {
      success: true,
      data: employee,
    }
  } catch (error: any) {
    console.error("createEmployee error:", error)

    return {
      success: false,
      error: error.message,
    }
  }
}

export async function updateEmployee(
  id: string,
  data: Partial<Employee>
) {
  try {
    const employee = await prisma.employee.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        department: data.department,
        designation: data.designation,
        salary: data.salary,
        status: data.status,
        attendancePercentage: data.attendancePercentage,
        address: data.address,
        joiningDate: data.joiningDate
          ? new Date(data.joiningDate)
          : undefined,
        imageUrl: data.imageUrl,
      },
    })

    revalidatePath("/employees")
    revalidatePath(`/employees/${id}/view`)

    return {
      success: true,
      data: employee,
    }
  } catch (error: any) {
    console.error("updateEmployee error:", error)

    return {
      success: false,
      error: error.message,
    }
  }
}

export async function deleteEmployee(id: string) {
  try {
    await prisma.employee.delete({
      where: { id },
    })

    revalidatePath("/employees")

    return {
      success: true,
    }
  } catch (error: any) {
    console.error("deleteEmployee error:", error)

    return {
      success: false,
      error: error.message,
    }
  }
}