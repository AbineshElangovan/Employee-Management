import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    console.log("Fetching employee id:", params.id)
    const employee = db.prepare(`SELECT * FROM employees WHERE id = ?`).get(params.id)
    console.log("Result:", employee)
    if (!employee) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(employee)
  } catch (error) {
    console.error("DB error:", error)
    return NextResponse.json({ error: "Failed to fetch employee" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    db.prepare(`
      UPDATE employees SET
        firstName = ?, lastName = ?, email = ?, phone = ?,
        address = ?, department = ?, designation = ?,
        joiningDate = ?, salary = ?, status = ?,
        attendancePercentage = ?, imageUrl = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      body.firstName, body.lastName, body.email, body.phone,
      body.address, body.department, body.designation,
      body.joiningDate, body.salary, body.status,
      body.attendancePercentage, body.imageUrl,
      params.id
    )
    const updated = db.prepare(`SELECT * FROM employees WHERE id = ?`).get(params.id)
    return NextResponse.json(updated)
  } catch (error) {
    console.error("PUT error:", error)
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    db.prepare(`DELETE FROM employees WHERE id = ?`).run(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 })
  }
}