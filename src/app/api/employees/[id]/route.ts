import { NextResponse } from "next/server"
import prisma from "@/src/lib/prisma"
import { Prisma } from "@prisma/client"
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const employee = await prisma.employee.findUnique({ where: { id } })
    if (!employee) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json({
      ...employee,
      joiningDate: employee.joiningDate.toISOString(),
      createdAt: employee.createdAt.toISOString(),
      updatedAt: employee.updatedAt.toISOString(),
    })
  } catch (error) {
    console.error("DB error:", error)
    return NextResponse.json({ error: "Failed to fetch employee" }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const updated = await prisma.employee.update({
      where: { id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        department: body.department,
        designation: body.designation,
        joiningDate: body.joiningDate ? new Date(body.joiningDate) : undefined,
        salary: body.salary,
        status: body.status,
        attendancePercentage: body.attendancePercentage,
        imageUrl: body.imageUrl,
      },
    })

    return NextResponse.json({
      ...updated,
      joiningDate: updated.joiningDate.toISOString(),
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    })
  } catch (error: any) {
    console.error("PUT error:", error)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const target = (error.meta?.target as string[])?.join(", ") || "field"
      return NextResponse.json({ error: `${target} already exists` }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.employee.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 })
  }
}