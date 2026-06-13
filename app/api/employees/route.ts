import { NextResponse } from "next/server"
import { openDb } from "@/lib/db"
import { Employee } from "@/app/types/employee"

export async function GET() {
  try {
    const db = await openDb()
    const employees: Employee[] = await db.all("SELECT * FROM employees ORDER BY firstName")
    return NextResponse.json(employees?? [])
  } catch (error) {
    console.error("Employees API Error:", error)
    return NextResponse.json([], { status: 200 })
  }
}