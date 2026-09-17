import { NextResponse } from "next/server"
import prisma from "@/src/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const allEmployees = await prisma.employee.findMany({
      select: {
        department: true,
        firstName: true,
        lastName: true,
        salary: true,
        designation: true,
        imageUrl: true,
        isFavorite: true,
        id: true,
      },
    })

    const byDept = new Map<string, typeof allEmployees>()
    for (const emp of allEmployees) {
      const deptKey = emp.department || "Unassigned"
      const list = byDept.get(deptKey) ?? []
      list.push(emp)
      byDept.set(deptKey, list)
    }

    const departments = Array.from(byDept.entries())
      .map(([department, emps]) => {
        const head = [...emps]
          .filter((e) => e.salary != null)
          .sort((a, b) => (b.salary ?? 0) - (a.salary ?? 0))[0]
        const favPerson = emps.find((e) => e.isFavorite) || head
        return {
          department,
          employeeCount: emps.length,
          headName: head ? `${head.firstName} ${head.lastName}` : null,
          headPerson: head
            ? {
                id: head.id,
                name: `${head.firstName} ${head.lastName}`,
                designation: head.designation,
                imageUrl: head.imageUrl,
              }
            : null,
          favoritePerson: favPerson
            ? {
                id: favPerson.id,
                name: `${favPerson.firstName} ${favPerson.lastName}`,
                designation: favPerson.designation,
                imageUrl: favPerson.imageUrl,
              }
            : null,
        }
      })
      .sort((a, b) => a.department.localeCompare(b.department))

    const aggregate = await prisma.employee.aggregate({
      _sum: { salary: true },
      _avg: { salary: true, attendancePercentage: true },
      _max: { salary: true },
      _min: { salary: true },
    })

    const stats = {
      totalSalary: aggregate._sum?.salary ?? 0,
      averageSalary: Math.round(aggregate._avg?.salary ?? 0),
      highestSalary: aggregate._max?.salary ?? 0,
      lowestSalary: aggregate._min?.salary ?? 0,
      averageAttendance: Math.round(aggregate._avg?.attendancePercentage ?? 0),
    }

    return NextResponse.json({ departments, stats })
  } catch (error) {
    console.error("Department analytics error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch department analytics" },
      { status: 500 }
    )
  }
}