"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import {
  Building2, Users, IndianRupee,
  TrendingUp, TrendingDown, Clock, Loader2, Crown, Heart,
} from "lucide-react"
import { toast } from "sonner"

type PersonSummary = {
  id: string
  name: string
  designation: string | null
  imageUrl: string | null
}

type Department = {
  department: string
  employeeCount: number
  headName: string | null
  headPerson?: PersonSummary | null
  favoritePerson?: PersonSummary | null
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
        const res = await fetch("/api/department", { cache: "no-store" })
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
                    <Card key={dept.department} className="transition hover:shadow-lg relative overflow-hidden border-border">
                      <CardContent className="p-5 sm:p-6 space-y-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                            <Users className="h-6 w-6 text-blue-500" />
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500/10 via-amber-500/10 to-rose-500/10 border border-purple-500/20">
                            <Crown className="h-3.5 w-3.5 fill-amber-500 text-amber-600" />
                            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-600" />
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold break-words">
                            {dept.department}
                          </h3>
                          <p className="text-blue-500 font-medium text-sm mt-0.5">
                            {dept.employeeCount} Employees
                          </p>
                        </div>

                        <div className="space-y-2 pt-3 border-t">
                          {/* Head section */}
                          <div className="flex items-center gap-3 bg-purple-500/5 p-2.5 rounded-lg border border-purple-500/15">
                            {dept.headPerson?.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={dept.headPerson.imageUrl}
                                alt={dept.headPerson.name}
                                className="h-9 w-9 rounded-full object-cover ring-2 ring-purple-500/50 shrink-0"
                              />
                            ) : (
                              <div className="h-9 w-9 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-600 shrink-0">
                                <Crown className="h-4 w-4 fill-amber-500 text-amber-600" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                👑 Head
                              </p>
                              <p className="font-semibold text-xs truncate">
                                {dept.headPerson?.name || dept.headName || "Not Assigned"}
                              </p>
                              {dept.headPerson?.designation && (
                                <p className="text-[11px] text-muted-foreground truncate">
                                  {dept.headPerson.designation}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Fav section */}
                          <div className="flex items-center gap-3 bg-rose-500/5 p-2.5 rounded-lg border border-rose-500/15">
                            {dept.favoritePerson?.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={dept.favoritePerson.imageUrl}
                                alt={dept.favoritePerson.name}
                                className="h-9 w-9 rounded-full object-cover ring-2 ring-rose-500/50 shrink-0"
                              />
                            ) : (
                              <div className="h-9 w-9 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-600 shrink-0">
                                <Heart className="h-4 w-4 fill-rose-500 text-rose-600" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                ❤️ Fav
                              </p>
                              <p className="font-semibold text-xs truncate">
                                {dept.favoritePerson?.name || "Not Assigned"}
                              </p>
                              {dept.favoritePerson?.designation && (
                                <p className="text-[11px] text-muted-foreground truncate">
                                  {dept.favoritePerson.designation}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
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