import { NextResponse } from "next/server"
import db from "@/lib/db"
import { nanoid } from "nanoid"

export async function GET() {
  try {
    const employees = db.prepare("SELECT * FROM employees").all()
    return NextResponse.json(employees)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const id = nanoid()

    const stmt = db.prepare(`
      INSERT INTO employees (
        id, imageUrl, employeeId, firstName, lastName, email, phone,
        department, designation, joiningDate, salary, status,
        attendancePercentage, address, createdAt, updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `)

    stmt.run(
      id,
      body.imageUrl || null,
      body.employeeId,
      body.firstName,
      body.lastName,
      body.email,
      body.phone,
      body.department,
      body.designation || null,
      body.joiningDate,
      Number(body.salary || 0),
      body.status || 'active',
      Number(body.attendancePercentage || 0),
      body.address
    )

    const newEmployee = db.prepare("SELECT * FROM employees WHERE id = ?").get(id)
    return NextResponse.json(newEmployee)
  } catch (error: any) {
    console.error("Create Employee Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}