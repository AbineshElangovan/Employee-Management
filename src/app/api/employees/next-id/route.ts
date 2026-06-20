import { NextResponse } from "next/server"
import prisma from "@/src/lib/prisma"

export async function GET() {
  try {
    const rows = await prisma.employee.findMany({
      select: { employeeId: true },
    })

    let maxNum = 0
    for (const row of rows) {
      const match = row.employeeId.match(/\d+/)
      if (match) {
        const num = parseInt(match[0], 10)
        if (num > maxNum) maxNum = num
      }
    }

    const nextId = `EMP${String(maxNum + 1).padStart(3, "0")}`

    return NextResponse.json({ employeeId: nextId })
  } catch (error) {
    console.error("Next ID error:", error)
    return NextResponse.json({ error: "Failed to generate ID" }, { status: 500 })
  }
}