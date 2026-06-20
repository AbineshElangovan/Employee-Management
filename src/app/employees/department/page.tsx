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
      <div className="min-h-screen bg-muted/30 flex items-center justify-center text-muted-foreground">
        Unable to load department analytics.
      </div>
    )
  }

  const { departments, stats } = data

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