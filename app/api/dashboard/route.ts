import { NextResponse } from "next/server"
import { openDb } from "@/lib/db"

export async function GET() {
  try {
    const db = await openDb()
    
    const total = await db.get("SELECT COUNT(*) as count FROM employees")
    const active = await db.get("SELECT COUNT(*) as count FROM employees WHERE status = 'Active'")
    const inactive = await db.get("SELECT COUNT(*) as count FROM employees WHERE status = 'Inactive'")
    const onLeave = await db.get("SELECT COUNT(*) as count FROM employees WHERE status = 'On Leave'")
    const avgAttendance = await db.get("SELECT AVG(attendancePercentage) as avg FROM employees")
    const departments = await db.get("SELECT COUNT(DISTINCT department) as count FROM employees")
    
    const recentEmployees = await db.all("SELECT * FROM employees ORDER BY joiningDate DESC LIMIT 5")
    
    const deptSummary = await db.all(`
      SELECT department, COUNT(*) as count,
      ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM employees), 0) as percentage
      FROM employees GROUP BY department
    `)

    return NextResponse.json({
      totalEmployees: total?.count || 0,
      activeEmployees: active?.count || 0,
      inactiveEmployees: inactive?.count || 0,
      employeesOnLeave: onLeave?.count || 0,
      totalDepartments: departments?.count || 0,
      averageAttendance: Math.round(avgAttendance?.avg || 0),
      recentEmployees: recentEmployees || [],
      departmentSummary: deptSummary || []
    })
  } catch (error) {
    console.error("Dashboard API Error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}