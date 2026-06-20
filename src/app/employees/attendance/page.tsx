"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Input } from "@/src/components/ui/input"
import {
  Loader2,
  ArrowLeft,
  Users,
  TrendingUp,
  TrendingDown,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MinusCircle,
} from "lucide-react"
import { toast } from "sonner"

interface Employee {
  id: string
  firstName: string
  lastName: string
  employeeId: string
  department: string
  attendancePercentage: number
}

interface AttendanceStats {
  average: number
  excellent: number
  good: number
  averageCount: number
  poor: number
}

interface AttendanceData {
  employees: Employee[]
  stats: AttendanceStats
}

function getAttendanceBadge(percentage: number) {
  if (percentage >= 90)
    return {
      label: "Excellent",
      className: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
      icon: CheckCircle2,
    }
  if (percentage >= 75)
    return {
      label: "Good",
      className: "bg-blue-500/20 text-blue-500 border-blue-500/30",
      icon: TrendingUp,
    }
  if (percentage >= 50)
    return {
      label: "Average",
      className: "bg-amber-500/20 text-amber-500 border-amber-500/30",
      icon: MinusCircle,
    }
  return {
    label: "Poor",
    className: "bg-red-500/20 text-red-500 border-red-500/30",
    icon: XCircle,
  }
}

function AttendanceBar({ percentage }: { percentage: number }) {
  const color =
    percentage >= 90
      ? "bg-emerald-500"
      : percentage >= 75
      ? "bg-blue-500"
      : percentage >= 50
      ? "bg-amber-500"
      : "bg-red-500"

  return (
    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  )
}

export default function AttendancePage() {
  const router = useRouter()

  const [data, setData] = useState<AttendanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

useEffect(() => {
  setLoading(true)
  setFetchError(null)

  const controller = new AbortController()

  const timeout = setTimeout(() => {
    controller.abort()
  }, 15000)

  fetch("/api/attendance", {
    signal: controller.signal,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Server error: ${res.status} ${res.statusText}`)
      }
      return res.json()
    })
    .then((json: AttendanceData) => {
      setData(json)
    })
    .catch((err: Error) => {
      if (err.name === "AbortError") {
        return
      }

      setFetchError(err.message)
      toast.error("Failed to load attendance data.")
    })
    .finally(() => {
      clearTimeout(timeout)
      setLoading(false)
    })

  return () => {
    clearTimeout(timeout)
    controller.abort()
  }
}, [])

  const filtered = data?.employees.filter((emp) => {
    const q = search.toLowerCase()
    return (
      emp.firstName.toLowerCase().includes(q) ||
      emp.lastName.toLowerCase().includes(q) ||
      emp.employeeId.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q)
    )
  })

  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }


  if (fetchError || !data) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-muted-foreground">{fetchError ?? "No attendance data found."}</p>
        <Button variant="outline" onClick={() => router.push("/employees")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Employees
        </Button>
      </div>
    )
  }

  const { stats, employees } = data

  // ── Page ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 md:p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Attendance Overview</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {employees.length} employee{employees.length !== 1 ? "s" : ""} tracked
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/employees")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="lg:col-span-1 sm:col-span-2">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Company Average</p>
                  <p className="text-2xl font-bold">{stats.average}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {[
            { label: "Excellent", count: stats.excellent, color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2 },
            { label: "Good",      count: stats.good,      color: "text-blue-500",    bg: "bg-blue-500/10",    icon: TrendingUp   },
            { label: "Average",   count: stats.averageCount, color: "text-amber-500", bg: "bg-amber-500/10", icon: MinusCircle  },
            { label: "Poor",      count: stats.poor,      color: "text-red-500",     bg: "bg-red-500/10",     icon: XCircle      },
          ].map(({ label, count, color, bg, icon: Icon }) => (
            <Card key={label}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Employee Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              Employee Attendance
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, department…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filtered && filtered.length > 0 ? (
              <div className="divide-y divide-border">
                {filtered.map((emp) => {
                  const badge = getAttendanceBadge(emp.attendancePercentage)
                  const Icon = badge.icon
                  return (
                    <div
                      key={emp.id}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors cursor-pointer"
                      onClick={() => router.push(`/employees/${emp.id}`)}
                    >
                      {/* Avatar */}
                      <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0 text-sm font-semibold text-muted-foreground">
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>

                      {/* Name + dept */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {emp.employeeId} · {emp.department}
                        </p>
                      </div>

                      {/* Bar */}
                      <div className="hidden sm:flex flex-col gap-1 w-32">
                        <AttendanceBar percentage={emp.attendancePercentage} />
                        <p className="text-xs text-muted-foreground text-right">
                          {emp.attendancePercentage}%
                        </p>
                      </div>

                      {/* Badge */}
                      <Badge className={`gap-1.5 shrink-0 ${badge.className}`}>
                        <Icon className="h-3 w-3" />
                        {badge.label}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                <TrendingDown className="h-8 w-8" />
                <p className="text-sm">
                  {search ? "No employees match your search." : "No attendance data available."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

      </main>
    </div>
  )
}
