import { NextResponse } from "next/server"
import prisma from "@/src/lib/prisma"

export async function GET() {
  try {
    const employees = await prisma.employee.findMany()

    return NextResponse.json({
      count: employees.length,
      data: employees,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch employees test data",
      },
      { status: 500 }
    )
  }
}