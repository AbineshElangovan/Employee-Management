import { NextResponse } from "next/server"
import db from "@/lib/db"

type Department = {
  department: string
  employeeCount: number
  headName: string | null
}

type Stats = {
  totalSalary: number
  averageSalary: number
  highestSalary: number
  lowestSalary: number
  averageAttendance: number
}

export async function GET() {
  try {
    const departments = db
      .prepare(`
        SELECT
          e1.department,
          COUNT(*) AS employeeCount,
          (
            SELECT firstName || ' ' || lastName
            FROM employees e2
            WHERE e2.department = e1.department
              AND e2.salary IS NOT NULL
            ORDER BY e2.salary DESC
            LIMIT 1
          ) AS headName
        FROM employees e1
        GROUP BY e1.department
        ORDER BY e1.department
      `)
      .all() as Department[]

    const rawStats = db
      .prepare(`
        SELECT
          COALESCE(SUM(salary), 0)               AS totalSalary,
          COALESCE(AVG(salary), 0)               AS averageSalary,
          COALESCE(MAX(salary), 0)               AS highestSalary,
          COALESCE(MIN(salary), 0)               AS lowestSalary,
          COALESCE(AVG(attendancePercentage), 0) AS averageAttendance
        FROM employees
      `)
      .get() as Stats | undefined

    const stats = rawStats ?? {
      totalSalary: 0,
      averageSalary: 0,
      highestSalary: 0,
      lowestSalary: 0,
      averageAttendance: 0,
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