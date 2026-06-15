"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { TrendingUp } from "lucide-react"
import { Header } from "@/components/header"

type Employee = {
  id: string
  firstName: string
  lastName: string
  employeeId: string
  department: string
  attendancePercentage: number
}

type Stats = {
  avg: number
  excellent: number
  good: number
  average: number
  poor: number
}

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [deptFilter, setDeptFilter] = useState("all")
  const [rangeFilter, setRangeFilter] = useState("all")
  const [stats, setStats] = useState<Stats>({
    avg: 0,
    excellent: 0,
    good: 0,
    average: 0,
    poor: 0,
  })

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    filterEmployees()
  }, [employees, deptFilter, rangeFilter])

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setEmployees(data)
      calculateStats(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data: Employee[]) => {
    const total = data.length
    if (total === 0) return

    const sum = data.reduce((acc, emp) => acc + (emp.attendancePercentage || 0), 0)
    const avg = Math.round(sum / total)

    const excellent = data.filter((e) => (e.attendancePercentage || 0) >= 90).length
    const good = data.filter((e) => {
      const p = e.attendancePercentage || 0
      return p >= 75 && p < 90
    }).length
    const average = data.filter((e) => {
      const p = e.attendancePercentage || 0
      return p >= 50 && p < 75
    }).length
    const poor = data.filter((e) => (e.attendancePercentage || 0) < 50).length

    setStats({ avg, excellent, good, average, poor })
  }

  const filterEmployees = () => {
    let filtered = [...employees]

    if (deptFilter!== "all") {
      filtered = filtered.filter((emp) => emp.department === deptFilter)
    }

    if (rangeFilter!== "all") {
      const [min, max] = rangeFilter.split("-").map(Number)
      filtered = filtered.filter((emp) => {
        const p = emp.attendancePercentage || 0
        return p >= min && p <= max
      })
    }

    setFilteredEmployees(filtered)
  }

  const getBadge = (percentage: number) => {
    if (percentage >= 90)
      return { label: "Excellent", class: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30" }
    if (percentage >= 75)
      return { label: "Good", class: "bg-green-500/20 text-green-500 border-green-500/30" }
    if (percentage >= 50)
      return { label: "Average", class: "bg-amber-500/20 text-amber-500 border-amber-500/30" }
    return { label: "Poor", class: "bg-red-500/20 text-red-500 border-red-500/30" }
  }

  const departments = [...new Set(employees.map((e) => e.department))]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="text-foreground p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Attendance Management</h1>
            <p className="text-muted-foreground mt-1">Monitor employee attendance records</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="rounded-lg border bg-card p-4">
              <label className="text-sm text-muted-foreground">Department</label>
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <label className="text-sm text-muted-foreground mt-4 block">Attendance Range</label>
              <Select value={rangeFilter} onValueChange={setRangeFilter}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="All Ranges" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ranges</SelectItem>
                  <SelectItem value="0-25">0-25%</SelectItem>
                  <SelectItem value="25-50">25-50%</SelectItem>
                  <SelectItem value="50-75">50-75%</SelectItem>
                  <SelectItem value="75-100">75-100%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-blue-600 text-white p-4">
              <p className="text-sm opacity-90">Average Attendance</p>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-4xl font-bold">{stats.avg}%</span>
                <Badge className="bg-white/20 text-white border-0 mb-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2%
                </Badge>
              </div>
            </div>

            <div className="rounded-lg bg-emerald-600 text-white p-4">
              <p className="text-sm opacity-90">Excellent</p>
              <p className="text-4xl font-bold mt-2">{stats.excellent}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 lg:col-span-1 lg:grid-cols-3">
              <div className="rounded-lg bg-green-500/90 text-white p-4">
                <p className="text-xs opacity-90">Good</p>
                <p className="text-2xl font-bold mt-1">{stats.good}</p>
              </div>
              <div className="rounded-lg bg-amber-500 text-white p-4">
                <p className="text-xs opacity-90">Average</p>
                <p className="text-2xl font-bold mt-1">{stats.average}</p>
              </div>
              <div className="rounded-lg bg-red-600 text-white p-4">
                <p className="text-xs opacity-90">Poor</p>
                <p className="text-2xl font-bold mt-1">{stats.poor}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Attendance Table</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Attendance %</TableHead>
                  <TableHead>Attendance Badge</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredEmployees.length === 0? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No employees found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((emp) => {
                    const badge = getBadge(emp.attendancePercentage || 0)
                    return (
                      <TableRow key={emp.id}>
                        <TableCell className="font-medium text-primary">
                          {emp.firstName} {emp.lastName}
                        </TableCell>
                        <TableCell>{emp.employeeId}</TableCell>
                        <TableCell>{emp.department}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Progress
                              value={emp.attendancePercentage || 0}
                              className="w-32 h-2"
                            />
                            <span className="text-sm font-medium w-12">
                              {emp.attendancePercentage || 0}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={badge.class}>{badge.label}</Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}