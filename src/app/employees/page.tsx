"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { ArrowLeft, Pencil, Search, Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"

type Employee = {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  department: string
  designation?: string
  salary: number
  attendancePercentage?: number
  status: string
  imageUrl?: string
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [deptFilter, setDeptFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/employees")
        if (!res.ok) throw new Error("Failed to fetch")
        const json = await res.json()
        setEmployees(json)
      } catch (error) {
        toast.error("Failed to load employees")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  const filteredEmployees = useCallback(() => {
    let filtered = [...employees]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(term) ||
          emp.lastName.toLowerCase().includes(term) ||
          emp.email.toLowerCase().includes(term) ||
          emp.employeeId.toLowerCase().includes(term)
      )
    }

    if (deptFilter !== "all") {
      filtered = filtered.filter((emp) => emp.department === deptFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((emp) => emp.status === statusFilter)
    }

    return filtered
  }, [employees, searchTerm, deptFilter, statusFilter])

  const getStatusColor = (status: string) => {
    if (status === "active") return "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
    if (status === "on_leave") return "bg-amber-500/20 text-amber-500 border-amber-500/30"
    return "bg-red-500/20 text-red-500 border-red-500/30"
  }

  const getStatusLabel = (status: string) => {
    if (status === "active") return "Active"
    if (status === "on_leave") return "On Leave"
    return "Inactive"
  }

  const filtered = filteredEmployees()
  const departments = [...new Set(employees.map((e) => e.department))]
  const displayEmployees = showAll ? filtered : filtered.slice(0, 10)

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="text-foreground p-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-lg border bg-card p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" size="icon" asChild>
                <Link href="/" aria-label="Back to Dashboard">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h2 className="text-xl font-semibold">Employee Master Database</h2>
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
              <div className="relative flex-1 min-w-50">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={deptFilter} onValueChange={(val) => setDeptFilter(val ?? "all")}>
                <SelectTrigger className="w-35">
                  <SelectValue placeholder="Dept" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 mb-4">
              {["all", "active", "inactive", "on_leave"].map((s) => (
                <Button
                  key={s}
                  variant={statusFilter === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(s)}
                >
                  {s === "all" ? "All Employees" : getStatusLabel(s)}
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profile Photo</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      No employees found.
                    </TableCell>
                  </TableRow>
                ) : (
                  displayEmployees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell>
                        {emp.imageUrl ? (
                          <Image
                            src={emp.imageUrl}
                            alt={emp.firstName}
                            width={40}
                            height={40}
                            className="rounded-full object-cover border"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                            {emp.firstName[0]}
                            {emp.lastName[0]}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{emp.employeeId}</TableCell>
                      <TableCell className="font-medium text-primary">
                        {emp.firstName} {emp.lastName}
                      </TableCell>
                      <TableCell>{emp.department}</TableCell>
                      <TableCell>₹{emp.salary.toLocaleString("en-IN")}</TableCell>
                      <TableCell>{emp.attendancePercentage ?? 0}%</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(emp.status)}>
                          <span className="mr-1.5 h-2 w-2 rounded-full bg-current" />
                          {getStatusLabel(emp.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/employees/${emp.id}/view`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/employees/${emp.id}/edit`}>
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {filtered.length > 10 && (
              <div className="p-4 border-t text-center">
                <Button variant="outline" onClick={() => setShowAll(!showAll)}>
                  {showAll ? "Show Less" : `Show All (${filtered.length})`}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}