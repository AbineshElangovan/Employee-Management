import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
  try {
    const employees = db.prepare(`
      SELECT *
      FROM employees
      ORDER BY createdAt DESC
    `).all()

    return NextResponse.json(employees)
  } catch (error) {
    console.error("Employees Error:", error)

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