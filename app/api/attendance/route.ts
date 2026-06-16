import { NextResponse } from "next/server"
import db from "@/lib/db"

export const dynamic = 'force-dynamic'

interface Employee {
  id: string
  firstName: string
  lastName: string
  employeeId: string
  department: string
  attendancePercentage: number
}

export async function GET() {
  try {
    const employees = db.prepare(
      `SELECT id, firstName, lastName, employeeId, department, attendancePercentage 
       FROM employees 
       WHERE attendancePercentage IS NOT NULL 
       ORDER BY attendancePercentage DESC`
    ).all() as Employee[]

    const stats = {
      average: employees.length > 0 
        ? Math.round(employees.reduce((acc: number, e: Employee) => acc + (e.attendancePercentage || 0), 0) / employees.length) 
        : 0,
      excellent: employees.filter((e: Employee) => e.attendancePercentage >= 90).length,
      good: employees.filter((e: Employee) => e.attendancePercentage >= 75 && e.attendancePercentage < 90).length,
      averageCount: employees.filter((e: Employee) => e.attendancePercentage >= 50 && e.attendancePercentage < 75).length,
      poor: employees.filter((e: Employee) => e.attendancePercentage < 50).length
    }

    return NextResponse.json({ employees, stats })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 })
  }
}