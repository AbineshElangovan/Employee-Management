import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const employee = db.prepare("SELECT * FROM employees WHERE id = ?").get(params.id) as any

    if (!employee) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

   
    if (employee.status) {
      employee.status = employee.status.toLowerCase().replace(/\s+/g, "_")
    }

   
    if (!employee.imageUrl && employee.Image) {
      employee.imageUrl = employee.Image
    }

    return NextResponse.json(employee)
  } catch (error) {
    console.error("GET employee error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()

    db.prepare(`
      UPDATE employees SET
        firstName = ?,
        lastName = ?,
        email = ?,
        phone = ?,
        department = ?,
        designation = ?,
        salary = ?,
        status = ?,
        address = ?,
        attendancePercentage = ?,
        updatedAt = datetime('now')
      WHERE id = ?
    `).run(
      body.firstName,
      body.lastName,
      body.email,
      body.phone ?? null,
      body.department,
      body.designation ?? null,
      body.salary,
      body.status,
      body.address ?? null,
      body.attendancePercentage ?? 0,
      params.id
    )

    const updated = db.prepare("SELECT * FROM employees WHERE id = ?").get(params.id)
    return NextResponse.json(updated)
  } catch (error) {
    console.error("PUT employee error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    db.prepare("DELETE FROM employees WHERE id = ?").run(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE employee error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}