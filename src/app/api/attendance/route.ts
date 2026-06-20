import { NextResponse } from "next/server"
import prisma from "@/src/lib/prisma"

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        employeeId: true,
        department: true,
        attendancePercentage: true,
      },
      orderBy: { attendancePercentage: "desc" },
    })

    const excellent = employees.filter((e) => e.attendancePercentage >= 90).length
    const good = employees.filter(
      (e) => e.attendancePercentage >= 75 && e.attendancePercentage < 90
    ).length
    const averageCount = employees.filter(
      (e) => e.attendancePercentage >= 50 && e.attendancePercentage < 75
    ).length
    const poor = employees.filter((e) => e.attendancePercentage < 50).length

    const average =
      employees.length > 0
        ? Math.round(
            employees.reduce((sum, e) => sum + (e.attendancePercentage ?? 0), 0) /
              employees.length
          )
        : 0

    const stats = { average, excellent, good, averageCount, poor }

    return NextResponse.json({ employees, stats })
  } catch (error) {
    console.error("Attendance fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    )
  }
}