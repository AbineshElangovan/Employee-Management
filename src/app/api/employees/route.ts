import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/src/lib/verifyToken"
import prisma from "@/src/lib/prisma"

export async function GET(request: NextRequest) {
  const authError = verifyToken(request)
  if (authError) return authError

  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(
      employees.map((e) => ({
        ...e,
        joiningDate: e.joiningDate.toISOString(),
        createdAt:   e.createdAt.toISOString(),
        updatedAt:   e.updatedAt.toISOString(),
      }))
    )
  } catch (error) {
    console.error("Employees fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    )
  }
}