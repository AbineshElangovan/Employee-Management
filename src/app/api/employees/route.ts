import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/src/lib/verifyToken"
import prisma from "@/src/lib/prisma"

export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  const authError = verifyToken(request)
  if (authError) return authError

  try {
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

    return NextResponse.json(
      employees.map((e) => {
        const maxSal = e.department ? maxSalaryMap.get(e.department) : null
        const isHead = Boolean(
          e.department &&
          e.salary != null &&
          maxSal != null &&
          e.salary === maxSal &&
          e.salary > 0
        )
        return {
          ...e,
          isHead,
          joiningDate: e.joiningDate.toISOString(),
          createdAt: e.createdAt.toISOString(),
          updatedAt: e.updatedAt.toISOString(),
        }
      })
    )
  } catch (error) {
    console.error("Employees fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    )
  }
}