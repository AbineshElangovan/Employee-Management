"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import {
  Building2, Users, IndianRupee,
  TrendingUp, TrendingDown, Clock, Loader2,
} from "lucide-react"
import { toast } from "sonner"

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

type DepartmentsResponse = {
  departments: Department[]
  stats: Stats
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

export default function DepartmentPage() {
  const [data, setData] = useState<DepartmentsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("/api/department")
        if (!res.ok) {
          const body = await res.text().catch(() => "")
          throw new Error(`Request failed: ${res.status} ${res.statusText} — ${body}`)
        }
        const json = await res.json()
        setData(json)
      } catch (error) {
        toast.error("Failed to load department analytics")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center text-muted-foreground px-4 text-center">
        Unable to load department analytics.
      </div>
    )
  }

  const { departments, stats } = data

  return (
    <div className="min-h-screen bg-muted/30">
      <main className="w-full px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">

        {/* Page header */}
        <Card>
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 sm:p-8">
            <div className="rounded-xl bg-blue-600 p-3 sm:p-4 text-white shrink-0">
              <Building2 className="h-7 w-7 sm:h-10 sm:w-10" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                Department Management &amp; Analytics
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mt-1">
                View and manage department details and key company analytics
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-4 sm:gap-6">

          {/* Department cards */}
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl">Department Overview</CardTitle>
              <p className="text-muted-foreground text-sm sm:text-base">
                Manage departments and view employee details
              </p>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              {departments.length === 0 ? (
                <p className="text-muted-foreground text-sm">No departments found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                  {departments.map((dept) => (
                    <Card key={dept.department} className="transition hover:shadow-lg">
                      <CardContent className="p-5 sm:p-6">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-100 flex items-center justify-center mb-3 sm:mb-4">
                          <Users className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold break-words">
                          {dept.department}
                        </h3>
                        <p className="text-blue-600 font-medium mt-2 text-sm sm:text-base">
                          {dept.employeeCount} Employees
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4 break-words">
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
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl">Employee Analytics</CardTitle>
              <p className="text-muted-foreground text-sm sm:text-base">Key insights and statistics</p>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {ANALYTICS_CARDS.map(({ key, label, icon: Icon, color, format }) => (
                  <Card key={key}>
                    <CardContent className="p-4 sm:p-5 overflow-hidden">
                      <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${color} mb-2 sm:mb-3`} />
                      <p className="text-muted-foreground text-xs sm:text-sm">{label}</p>
                      <h2
                        className={`font-bold mt-1 whitespace-nowrap text-[clamp(0.95rem,5vw,1.5rem)] sm:text-2xl lg:text-3xl ${
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