"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

type Employee = {
  id: number
  firstName: string
  lastName: string
  employeeId: string
  department: string
  attendancePercentage: number
}

type Stats = {
  average: number
  excellent: number
  good: number
  averageCount: number
  poor: number
}

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/attendance")
      .then(res => res.json())
      .then(data => {
        setEmployees(data.employees || [])
        setStats(data.stats || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getBadgeVariant = (percentage: number) => {
    if (percentage >= 90) return "default"
    if (percentage >= 75) return "secondary"
    if (percentage >= 50) return "outline"
    return "destructive"
  }

  const getStatus = (percentage: number) => {
    if (percentage >= 90) return "Excellent"
    if (percentage >= 75) return "Good"
    if (percentage >= 50) return "Average"
    return "Poor"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">Monitor employee attendance records</p>
        </div>

        {stats && (
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.average}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Excellent ≥90%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.excellent}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Good 75-89%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.good}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average 50-74%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Poor &lt;50%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.poor}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Employee Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No attendance data found</TableCell>
                  </TableRow>
                ) : (
                  employees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell>{emp.firstName} {emp.lastName}</TableCell>
                      <TableCell>{emp.employeeId}</TableCell>
                      <TableCell>{emp.department}</TableCell>
                      <TableCell>{emp.attendancePercentage}%</TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(emp.attendancePercentage)}>
                          {getStatus(emp.attendancePercentage)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}