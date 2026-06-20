import { NextResponse } from "next/server"
import prisma from "@/src/lib/prisma"

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(
      employees.map((e) => ({
        ...e,
        joiningDate: e.joiningDate.toISOString(),
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
      }))
    )
  } catch (error) {
    console.error("Employees fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}