import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
  try {
    const departments = db.prepare(`
      SELECT
        department,
        COUNT(*) as employeeCount
      FROM employees
      GROUP BY department
      ORDER BY department
    `).all()

    return NextResponse.json({
      departments,
    })
  } catch (error) {
    console.error("Departments Error:", error)

    return NextResponse.json(
      {
        departments: [],
      },
      { status: 500 }
    )
  }
}