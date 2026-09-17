"use server"

import prisma from "@/src/lib/prisma"
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
  isFavorite?: boolean
  isHead?: boolean
  createdAt?: string
  updatedAt?: string
}

function serializeEmployee(employee: any): Employee {
  return {
    ...employee,
    joiningDate: employee.joiningDate.toISOString(),
    createdAt: employee.createdAt?.toISOString(),
    updatedAt: employee.updatedAt?.toISOString(),
  }
}

export async function getEmployees(): Promise<Employee[]> {
  const employees = await prisma.employee.findMany({
    orderBy: { createdAt: "desc" },
  })

  const maxSalaryMap = new Map<string, number>()
  for (const emp of employees) {
    if (emp.department && emp.salary != null) {
      const curr = maxSalaryMap.get(emp.department) ?? -1
      if (emp.salary > curr) {
        maxSalaryMap.set(emp.department, emp.salary)
      }
    }
  }

  return employees.map((emp) => {
    const serialized = serializeEmployee(emp)
    const maxSal = emp.department ? maxSalaryMap.get(emp.department) : null
    const isHead = Boolean(
      emp.department &&
      emp.salary != null &&
      maxSal != null &&
      emp.salary === maxSal &&
      emp.salary > 0
    )
    return { ...serialized, isHead }
  })
}

export async function getEmployee(id: string): Promise<Employee | null> {
  const employee = await prisma.employee.findUnique({ where: { id } })
  if (!employee) return null

  let isHead = false
  if (employee.department && employee.salary != null && employee.salary > 0) {
    const highestInDept = await prisma.employee.findFirst({
      where: { department: employee.department },
      orderBy: { salary: "desc" },
      select: { id: true },
    })
    if (highestInDept?.id === employee.id) {
      isHead = true
    }
  }

  return { ...serializeEmployee(employee), isHead }
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
    return { success: true }
  } catch (error: any) {
    console.error("deleteEmployee error:", error)
    return { success: false, error: error.message }
  }
}

export async function toggleDepartmentFavorite(id: string) {
  try {
    const current = await prisma.employee.findUnique({
      where: { id },
      select: { department: true, isFavorite: true },
    })
    if (!current) return { success: false, error: "Employee not found" }

    if (!current.isFavorite && current.department) {
      await prisma.employee.updateMany({
        where: { department: current.department },
        data: { isFavorite: false },
      })
    }

    const updated = await prisma.employee.update({
      where: { id },
      data: { isFavorite: !current.isFavorite },
    })

    return { success: true, data: serializeEmployee(updated) }
  } catch (error: any) {
    console.error("toggleDepartmentFavorite error:", error)
    return { success: false, error: error.message }
  }
}