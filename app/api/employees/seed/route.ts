import { NextResponse } from "next/server"
import db from "@/lib/db"
import { nanoid } from "nanoid"

export async function GET() {
  try {
    const testEmployees = [
      {
        id: nanoid(),
        imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
        firstName: "John",
        lastName: "Doe",
        email: "john@demo.com",
        phone: "9876543210",
        address: "Chennai",
        employeeId: "EMP001",
        department: "Engineering",
        designation: "Developer",
        joiningDate: "2024-01-15",
        salary: 75000,
        status: "active",
        attendancePercentage: 95,
        createdAt: new Date().toISOString(),
      },
      {
        id: nanoid(),
        imageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@demo.com",
        phone: "9876543211",
        address: "Bangalore",
        employeeId: "EMP002",
        department: "HR",
        designation: "Manager",
        joiningDate: "2024-02-01",
        salary: 85000,
        status: "active",
        attendancePercentage: 98,
        createdAt: new Date().toISOString(),
      },
    ]

    // clear table
    db.prepare("DELETE FROM employees").run()

    const stmt = db.prepare(`
      INSERT INTO employees (
        id, imageUrl, firstName, lastName, email, phone, address, employeeId,
        department, designation, joiningDate, salary, status,
        attendancePercentage, createdAt, updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `)

    for (const emp of testEmployees) {
      stmt.run(
        emp.id,
        emp.imageUrl,
        emp.firstName,
        emp.lastName,
        emp.email,
        emp.phone,
        emp.address,
        emp.employeeId,
        emp.department,
        emp.designation,
        emp.joiningDate,
        emp.salary,
        emp.status,
        emp.attendancePercentage,
        emp.createdAt
      )
    }

    return NextResponse.json({
      message: "Seeded successfully",
      count: testEmployees.length,
    })
  } catch (error) {
    console.error("Seed Route Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}