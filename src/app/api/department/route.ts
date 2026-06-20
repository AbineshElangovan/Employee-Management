import { NextResponse } from "next/server"
import prisma from "@/src/lib/prisma"

export async function GET() {
  try {
    const allEmployees = await prisma.employee.findMany({
      select: {
        department: true,
        firstName: true,
        lastName: true,
        salary: true,
      },
    })

    const byDept = new Map<string, typeof allEmployees>()
    for (const emp of allEmployees) {
      const list = byDept.get(emp.department) ?? []
      list.push(emp)
      byDept.set(emp.department, list)
    }

    const departments = Array.from(byDept.entries())
      .map(([department, emps]) => {
        const head = [...emps]
          .filter((e) => e.salary != null)
          .sort((a, b) => b.salary - a.salary)[0]
        return {
          department,
          employeeCount: emps.length,
          headName: head ? `${head.firstName} ${head.lastName}` : null,
        }
      })
      .sort((a, b) => a.department.localeCompare(b.department))

    const aggregate = await prisma.employee.aggregate({
      _sum: { salary: true },
      _avg: { salary: true, attendancePercentage: true },
      _max: { salary: true },
      _min: { salary: true },
    })

    const stats = {
      totalSalary: aggregate._sum.salary ?? 0,
      averageSalary: Math.round(aggregate._avg.salary ?? 0),
      highestSalary: aggregate._max.salary ?? 0,
      lowestSalary: aggregate._min.salary ?? 0,
      averageAttendance: Math.round(aggregate._avg.attendancePercentage ?? 0),
    }

    return NextResponse.json({ departments, stats })
  } catch (error) {
    console.error("Department analytics error:", error)
    return NextResponse.json(
      { error: "Failed to fetch department analytics" },
      { status: 500 }
    )
  }
}