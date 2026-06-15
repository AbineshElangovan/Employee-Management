import { NextResponse } from "next/server"
import db  from "@/lib/db"

type DepartmentStat = {
  department: string
  count: number
}

export async function GET() {
  try {
    const db = await openDb()

    const totalEmployees = await db.get<{ count: number }>(
      "SELECT COUNT(*) as count FROM employees"
    )

    const activeEmployees = await db.get<{ count: number }>(
      "SELECT COUNT(*) as count FROM employees WHERE status = ?",
      ["active"]
    )

    const onLeaveEmployees = await db.get<{ count: number }>(
      "SELECT COUNT(*) as count FROM employees WHERE status = ?",
      ["on_leave"]
    )

    const deptStats = await db.all<DepartmentStat[]>(
      `
      SELECT department, COUNT(*) as count
      FROM employees
      GROUP BY department
      `
    )

    const avgSalary = await db.get<{ avg: number }>(
      "SELECT AVG(salary) as avg FROM employees"
    )

    const recentEmployees = await db.all(
      `
      SELECT *
      FROM employees
      ORDER BY createdAt DESC
      LIMIT 5
      `
    )

    const total = totalEmployees?.count || 1

    const departmentSummary = deptStats.map((dept) => ({
      name: dept.department,
      value: dept.count,
      percentage: Math.round((dept.count / total) * 100),
    }))

    return NextResponse.json({
      totalEmployees: totalEmployees?.count || 0,
      activeEmployees: activeEmployees?.count || 0,
      onLeaveEmployees: onLeaveEmployees?.count || 0,
      departmentSummary,
      averageSalary: Math.round(avgSalary?.avg || 0),
      recentEmployees,
    })
  } catch (error) {
    console.error("Dashboard Error:", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    )
  }
}