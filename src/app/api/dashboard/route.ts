import { NextResponse } from "next/server"
import db from "@/lib/db"

type DepartmentStat = {
  department: string
  count: number
}

export async function GET() {
  try {
    const totalEmployees = db.prepare("SELECT COUNT(*) as count FROM employees").get() as { count: number } | undefined
    const activeEmployees = db.prepare("SELECT COUNT(*) as count FROM employees WHERE status = ?").get("active") as { count: number } | undefined
    const onLeaveEmployees = db.prepare("SELECT COUNT(*) as count FROM employees WHERE status = ?").get("on_leave") as { count: number } | undefined

    const deptStats = db.prepare(`
      SELECT department, COUNT(*) as count
      FROM employees
      GROUP BY department
    `).all() as DepartmentStat[]

    const avgSalary = db.prepare("SELECT AVG(salary) as avg FROM employees").get() as { avg: number } | undefined

    const recentEmployees = db.prepare(`
      SELECT *
      FROM employees
      ORDER BY createdAt DESC
      LIMIT 9
    `).all()

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