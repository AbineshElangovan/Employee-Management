import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const employee = db.prepare('SELECT * FROM employees WHERE id =?').get(params.id)
    if (!employee) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(employee)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()

    const stmt = db.prepare(`
      UPDATE employees SET
        firstName =?, lastName =?, email =?, phone =?, address =?,
        employeeId =?, department =?, designation =?, joiningDate =?, salary =?,
        imageUrl =?, status =?, attendancePercentage =?, updatedAt = CURRENT_TIMESTAMP
      WHERE id =?
    `)

    stmt.run(
      body.firstName,
      body.lastName,
      body.email,
      body.phone,
      body.address,
      body.employeeId,
      body.department,
      body.designation || null,
      body.joiningDate,
      body.salary,
      body.imageUrl || null,
      body.status,
      body.attendancePercentage || 85,
      params.id
    )

    const employee = db.prepare('SELECT * FROM employees WHERE id =?').get(params.id)
    return NextResponse.json(employee)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    db.prepare('DELETE FROM employees WHERE id =?').run(params.id)
    return NextResponse.json({ message: "Deleted" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}