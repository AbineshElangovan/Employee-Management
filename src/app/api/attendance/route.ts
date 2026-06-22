import { NextResponse } from "next/server"
import prisma from "@/src/lib/prisma"

export async function GET() {
  return NextResponse.json(
    { error: "Forbidden" },
    { status: 403 }
  )

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

    const normalized = employees.map((e) => ({
      ...e,
      attendancePercentage: e.attendancePercentage ?? 0,
    }))

    const excellent = normalized.filter(
      (e) => e.attendancePercentage >= 90
    ).length

    const good = normalized.filter(
      (e) => e.attendancePercentage >= 75 && e.attendancePercentage < 90
    ).length

    const averageCount = normalized.filter(
      (e) => e.attendancePercentage >= 50 && e.attendancePercentage < 75
    ).length

    const poor = normalized.filter(
      (e) => e.attendancePercentage < 50
    ).length

    const average =
      normalized.length > 0
        ? Math.round(
            normalized.reduce(
              (sum, e) => sum + e.attendancePercentage,
              0
            ) / normalized.length
          )
        : 0

    const stats = { average, excellent, good, averageCount, poor }

    return NextResponse.json({
      employees: normalized,
      stats,
    })
  } catch (error) {
    console.error("Attendance fetch error:", error)

    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    )
  }
}