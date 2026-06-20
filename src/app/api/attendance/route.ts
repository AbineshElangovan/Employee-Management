import { NextResponse } from "next/server"
import db from "@/lib/db"

interface Employee {
  id: string
  firstName: string
  lastName: string
  employeeId: string
  department: string
  attendancePercentage: number
}

interface AttendanceStats {
  average: number
  excellent: number
  good: number
  averageCount: number
  poor: number
}

export async function GET() {
  try {
    const employees = db
      .prepare(
        `SELECT 
          id, 
          firstName, 
          lastName, 
          employeeId, 
          department, 
          COALESCE(attendancePercentage, 0) AS attendancePercentage
         FROM employees
         ORDER BY attendancePercentage DESC`
      )
      .all() as Employee[]

    const stats = db
      .prepare(
        `SELECT
          ROUND(COALESCE(AVG(attendancePercentage), 0)) AS average,
          COUNT(CASE WHEN attendancePercentage >= 90 THEN 1 END)                                        AS excellent,
          COUNT(CASE WHEN attendancePercentage >= 75 AND attendancePercentage < 90 THEN 1 END)          AS good,
          COUNT(CASE WHEN attendancePercentage >= 50 AND attendancePercentage < 75 THEN 1 END)          AS averageCount,
          COUNT(CASE WHEN attendancePercentage < 50  OR  attendancePercentage IS NULL THEN 1 END)       AS poor
        FROM employees`
      )
      .get() as AttendanceStats

    return NextResponse.json({ employees, stats })
  } catch (error) {
    console.error("Attendance fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    )
  }
}