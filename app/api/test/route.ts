import { NextResponse } from "next/server"
import { openDb } from "@/lib/db"

export async function GET() {
  try {
    const db = await openDb()

    const employees = await db.all(
      "SELECT * FROM employees"
    )

    return NextResponse.json({
      count: employees.length,
      data: employees,
    })
  } catch {
  return NextResponse.json(
    {
      error: "Failed to fetch dashboard data",
    },
    { status: 500 }
  )
}
}