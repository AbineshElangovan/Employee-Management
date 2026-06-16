import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Building2, Users, IndianRupee,
  TrendingUp, TrendingDown, Clock,
} from "lucide-react"
import db from "@/lib/db"

// ✅ ISR: revalidate every 1 hour — works here because this is a Server Component
export const revalidate = 60

type Department = {
  department: string
  employeeCount: number
  headName: string | null
}

type Stats = {
  totalSalary: number
  averageSalary: number
  highestSalary: number
  lowestSalary: number
  averageAttendance: number
}

const ANALYTICS_CARDS = [
  {
    key: "totalSalary" as const,
    label: "Total Salary Expense",
    icon: IndianRupee,
    color: "text-blue-600",
    format: (v: number) => `₹${v.toLocaleString("en-IN")}`,
  },
  {
    key: "averageSalary" as const,
    label: "Average Salary",
    icon: IndianRupee,
    color: "text-green-600",
    format: (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`,
  },
  {
    key: "highestSalary" as const,
    label: "Highest Salary",
    icon: TrendingUp,
    color: "text-green-600",
    format: (v: number) => `₹${v.toLocaleString("en-IN")}`,
  },
  {
    key: "lowestSalary" as const,
    label: "Lowest Salary",
    icon: TrendingDown,
    color: "text-red-600",
    format: (v: number) => `₹${v.toLocaleString("en-IN")}`,
  },
  {
    key: "averageAttendance" as const,
    label: "Average Attendance",
    icon: Clock,
    color: "text-indigo-600",
    format: (v: number) => `${Math.round(v)}%`,
  },
]

// ✅ Data fetching directly in the server component — no API round-trip needed
async function getDepartmentAnalytics(): Promise<{
  departments: Department[]
  stats: Stats
}> {
  const departments = db
    .prepare(`
      SELECT
        e1.department,
        COUNT(*) AS employeeCount,
        (
          SELECT firstName || ' ' || lastName
          FROM employees e2
          WHERE e2.department = e1.department
            AND e2.salary IS NOT NULL
          ORDER BY e2.salary DESC
          LIMIT 1
        ) AS headName
      FROM employees e1
      GROUP BY e1.department
      ORDER BY e1.department
    `)
    .all() as Department[]

  const rawStats = db
    .prepare(`
      SELECT
        COALESCE(SUM(salary), 0)               AS totalSalary,
        COALESCE(AVG(salary), 0)               AS averageSalary,
        COALESCE(MAX(salary), 0)               AS highestSalary,
        COALESCE(MIN(salary), 0)               AS lowestSalary,
        COALESCE(AVG(attendancePercentage), 0) AS averageAttendance
      FROM employees
    `)
    .get() as Stats | undefined

  const stats = rawStats ?? {
    totalSalary: 0,
    averageSalary: 0,
    highestSalary: 0,
    lowestSalary: 0,
    averageAttendance: 0,
  }

  return { departments, stats }
}

export default async function DepartmentPage() {
  const { departments, stats } = await getDepartmentAnalytics()

  return (
    <div className="min-h-screen bg-muted/30">
      <main className="w-full px-6 py-6 space-y-6">

        {/* Page header */}
        <Card>
          <CardContent className="flex items-center gap-4 p-8">
            <div className="rounded-xl bg-blue-600 p-4 text-white">
              <Building2 className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">
                Department Management &amp; Analytics
              </h1>
              <p className="text-muted-foreground text-lg">
                View and manage department details and key company analytics
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-6">

          {/* Department cards */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Department Overview</CardTitle>
              <p className="text-muted-foreground">
                Manage departments and view employee details
              </p>
            </CardHeader>
            <CardContent>
              {departments.length === 0 ? (
                <p className="text-muted-foreground text-sm">No departments found.</p>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {departments.map((dept) => (
                    <Card key={dept.department} className="transition hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                          <Users className="h-7 w-7 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold">{dept.department}</h3>
                        <p className="text-blue-600 font-medium mt-2">
                          {dept.employeeCount} Employees
                        </p>
                        <p className="text-sm text-muted-foreground mt-4">
                          Head:{" "}
                          <span className="font-medium text-foreground">
                            {dept.headName ?? "Not Assigned"}
                          </span>
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analytics cards */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Employee Analytics</CardTitle>
              <p className="text-muted-foreground">Key insights and statistics</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {ANALYTICS_CARDS.map(({ key, label, icon: Icon, color, format }) => (
                  <Card key={key}>
                    <CardContent className="p-5">
                      <Icon className={`h-8 w-8 ${color} mb-3`} />
                      <p className="text-muted-foreground text-sm">{label}</p>
                      <h2
                        className={`text-3xl font-bold mt-1 ${
                          key === "highestSalary"
                            ? "text-green-600"
                            : key === "lowestSalary"
                            ? "text-red-600"
                            : ""
                        }`}
                      >
                        {format(stats[key])}
                      </h2>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}