import { NextResponse } from "next/server"
import prisma from "@/src/lib/prisma"

export async function GET() {
  try {
    const allStatuses = await prisma.employee.findMany({
      select: { status: true },
    })

    const totalEmployees = allStatuses.length
    const activeEmployees = allStatuses.filter(
      (e) => e.status?.toLowerCase().replace(/[\s_]+/g, "") === "active"
    ).length
    const onLeaveEmployees = allStatuses.filter(
      (e) => e.status?.toLowerCase().replace(/[\s_]+/g, "") === "onleave"
    ).length

    const deptStats = await prisma.employee.groupBy({
      by: ["department"],
      _count: { department: true },
    })

    const salaryAgg = await prisma.employee.aggregate({
      _avg: { salary: true },
    })

    const recentEmployees = await prisma.employee.findMany({
      orderBy: { createdAt: "desc" },
      take: 11,
    })

    const allEmployeesForHeads = await prisma.employee.findMany({
      select: { id: true, department: true, salary: true },
    })
    const maxSalaryMap = new Map<string, number>()
    for (const emp of allEmployeesForHeads) {
      if (emp.department && emp.salary != null) {
        const curr = maxSalaryMap.get(emp.department) ?? -1
        if (emp.salary > curr) {
          maxSalaryMap.set(emp.department, emp.salary)
        }
      }
    }

    const total = totalEmployees || 1

    const departmentSummary = deptStats.map((dept) => ({
      name: dept.department,
      value: dept._count.department,
      percentage: Math.round((dept._count.department / total) * 100),
    }))

    return NextResponse.json({
      totalEmployees,
      activeEmployees,
      onLeaveEmployees,
      departmentSummary,
      averageSalary: Math.round(salaryAgg._avg.salary || 0),
      recentEmployees: recentEmployees.map((e) => {
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
      }),
    })
  } catch (error) {
    console.error("Dashboard Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}