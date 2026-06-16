import db from "@/lib/db"
import { Header } from "@/components/header"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Building2,
  Users,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Clock,
} from "lucide-react"

export const revalidate = 3600

type Department = {
  department: string
  employeeCount: number
  headName: string | null
}

async function getDepartmentAnalytics() {
  const departments = db
    .prepare(`
      SELECT
        e1.department,
        COUNT(*) as employeeCount,
        (
          SELECT firstName || ' ' || lastName
          FROM employees e2
          WHERE e2.department = e1.department
          ORDER BY salary DESC
          LIMIT 1
        ) as headName
      FROM employees e1
      GROUP BY e1.department
      ORDER BY e1.department
    `)
    .all() as Department[]

  const stats = db
    .prepare(`
      SELECT
        COALESCE(SUM(salary), 0) as totalSalary,
        COALESCE(AVG(salary), 0) as averageSalary,
        COALESCE(MAX(salary), 0) as highestSalary,
        COALESCE(MIN(salary), 0) as lowestSalary,
        COALESCE(AVG(attendancePercentage), 0) as averageAttendance
      FROM employees
    `)
    .get() as {
      totalSalary: number
      averageSalary: number
      highestSalary: number
      lowestSalary: number
      averageAttendance: number
    }

  return {
    departments,
    stats,
  }
}

export default async function DepartmentPage() {
  const { departments, stats } =
    await getDepartmentAnalytics()

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <main className="w-full px-6 py-6 space-y-6">
        {/* Hero Section */}
        <Card>
          <CardContent className="flex items-center gap-4 p-8">
            <div className="rounded-xl bg-blue-600 p-4 text-white">
              <Building2 className="h-10 w-10" />
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                Department Management & Analytics
              </h1>

              <p className="text-muted-foreground text-lg">
                View and manage department details and key company analytics
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
          {/* Department Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Department Overview
              </CardTitle>

              <p className="text-muted-foreground">
                Manage departments and view employee details
              </p>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {departments.map((dept) => (
                  <Card
                    key={dept.department}
                    className="transition hover:shadow-lg"
                  >
                    <CardContent className="p-6">
                      <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <Users className="h-7 w-7 text-blue-600" />
                      </div>

                      <h3 className="text-xl font-semibold">
                        {dept.department}
                      </h3>

                      <p className="text-blue-600 font-medium mt-2">
                        {dept.employeeCount} Employees
                      </p>

                      <p className="text-sm text-muted-foreground mt-4">
                        Head:{" "}
                        <span className="font-medium text-foreground">
                          {dept.headName || "Not Assigned"}
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Employee Analytics
              </CardTitle>

              <p className="text-muted-foreground">
                Key insights and statistics
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-5">
                    <IndianRupee className="h-8 w-8 text-blue-600 mb-3" />

                    <p className="text-muted-foreground">
                      Total Salary Expense
                    </p>

                    <h2 className="text-3xl font-bold">
                      ₹
                      {stats.totalSalary.toLocaleString(
                        "en-IN"
                      )}
                    </h2>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <IndianRupee className="h-8 w-8 text-green-600 mb-3" />

                    <p className="text-muted-foreground">
                      Average Salary
                    </p>

                    <h2 className="text-3xl font-bold">
                      ₹
                      {Math.round(
                        stats.averageSalary
                      ).toLocaleString("en-IN")}
                    </h2>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <TrendingUp className="h-8 w-8 text-green-600 mb-3" />

                    <p className="text-muted-foreground">
                      Highest Salary
                    </p>

                    <h2 className="text-3xl font-bold text-green-600">
                      ₹
                      {stats.highestSalary.toLocaleString(
                        "en-IN"
                      )}
                    </h2>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <TrendingDown className="h-8 w-8 text-red-600 mb-3" />

                    <p className="text-muted-foreground">
                      Lowest Salary
                    </p>

                    <h2 className="text-3xl font-bold text-red-600">
                      ₹
                      {stats.lowestSalary.toLocaleString(
                        "en-IN"
                      )}
                    </h2>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <Clock className="h-8 w-8 text-indigo-600 mb-3" />

                    <p className="text-muted-foreground">
                      Average Attendance
                    </p>

                    <h2 className="text-3xl font-bold">
                      {Math.round(
                        stats.averageAttendance
                      )}
                      %
                    </h2>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}