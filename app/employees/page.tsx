"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
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
import { Pencil, Search, Eye } from "lucide-react"
import { toast } from "sonner"
import { Header } from "@/components/header"

type Employee = {
  id: string
  firstName: string
  lastName: string
  email: string
  employeeId: string
  department: string
  designation?: string
  salary: number
  attendancePercentage?: number
  status: "Active" | "Inactive" | "On Leave"
  Image?: string | null
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [deptFilter, setDeptFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await fetch("/api/employees")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setEmployees(data)
    } catch {
      toast.error("Failed to load employees")
    } finally {
      setLoading(false)
    }
  }, [])

  const filterEmployees = useCallback(() => {
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

    if (deptFilter!== "all") {
      filtered = filtered.filter((emp) => emp.department === deptFilter)
    }

    if (statusFilter!== "all") {
      filtered = filtered.filter((emp) => emp.status === statusFilter)
    }

    setFilteredEmployees(filtered)
  }, [employees, searchTerm, deptFilter, statusFilter])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  useEffect(() => {
    filterEmployees()
  }, [filterEmployees])

  const getStatusColor = (status: string) => {
    if (status === "Active") return "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
    if (status === "On Leave") return "bg-amber-500/20 text-amber-500 border-amber-500/30"
    return "bg-red-500/20 text-red-500 border-red-500/30"
  }

  const departments = [...new Set(employees.map((e) => e.department))]
  const displayEmployees = showAll? filteredEmployees : filteredEmployees.slice(0, 10)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="text-foreground p-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-lg border bg-card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Employee Master Database</h2>

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
              <Select value={deptFilter} onValueChange={(val) => setDeptFilter(val?? "all")}>
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
              <Button
                variant={statusFilter === "all"? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All Employees
              </Button>
              <Button
                variant={statusFilter === "Active"? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("Active")}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "Inactive"? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("Inactive")}
              >
                Inactive
              </Button>
              <Button
                variant={statusFilter === "On Leave"? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("On Leave")}
              >
                On Leave
              </Button>
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
                  <TableHead>Designation</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-8">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Spinner />
                        <span>Loading employees...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : displayEmployees.length === 0? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      No employees found.
                    </TableCell>
                  </TableRow>
                ) : (
                  displayEmployees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell>
                        {emp.Image? (
                          <Image
                            src={emp.Image}
                            alt={emp.firstName}
                            width={40}
                            height={40}
                            className="rounded-full object-cover border"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm">
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
                      <TableCell>{emp.designation || "—"}</TableCell>
                      <TableCell>₹{emp.salary.toLocaleString("en-IN")}</TableCell>
                      <TableCell>{emp.attendancePercentage || 0}%</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(emp.status)}>
                          <span className="mr-1.5 h-2 w-2 rounded-full bg-current" />
                          {emp.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                         <Button variant="outline" size="sm" asChild>
                          <Link href={`/employees/${emp.id}`}>
                           <Eye className="h-4 w-4 mr-1" />
                               View
                                 </Link>
                            </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/employees/edit/${emp.id}`}>
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
            {filteredEmployees.length > 10 && (
              <div className="p-4 border-t text-center">
                <Button variant="outline" onClick={() => setShowAll(!showAll)}>
                  {showAll? "Show Less" : `Show All (${filteredEmployees.length})`}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}