import { NextResponse } from "next/server"
import prisma from "@/src/lib/prisma"

export async function GET() {
  try {
    const [totalEmployees, activeEmployees, onLeaveEmployees] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { status: "active" } }),
      prisma.employee.count({ where: { status: "on_leave" } }),
    ])

    const deptStats = await prisma.employee.groupBy({
      by: ["department"],
      _count: { department: true },
    })

    const salaryAgg = await prisma.employee.aggregate({
      _avg: { salary: true },
    })

    const recentEmployees = await prisma.employee.findMany({
      orderBy: { createdAt: "desc" },
      take: 9,
    })

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
      recentEmployees: recentEmployees.map((e) => ({
        ...e,
        joiningDate: e.joiningDate.toISOString(),
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error("Dashboard Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}