"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Plus, Pencil, Search, Eye } from "lucide-react"
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
  status: "active" | "inactive" | "on_leave"
  imageUrl?: string | null
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [deptFilter, setDeptFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    filterEmployees()
  }, [employees, searchTerm, deptFilter, statusFilter])

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setEmployees(data)
    } catch (error) {
      toast.error("Failed to load employees")
    } finally {
      setLoading(false)
    }
  }

  const filterEmployees = () => {
    let filtered = [...employees]

    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (deptFilter!== "all") {
      filtered = filtered.filter((emp) => emp.department === deptFilter)
    }

    if (statusFilter!== "all") {
      filtered = filtered.filter((emp) => emp.status === statusFilter)
    }

    setFilteredEmployees(filtered)
  }

  const getStatusColor = (status: string) => {
    if (status === "active") return "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
    if (status === "on_leave") return "bg-amber-500/20 text-amber-500 border-amber-500/30"
    return "bg-muted text-muted-foreground border-border"
  }

  const departments = [...new Set(employees.map((e) => e.department))]
  const displayEmployees = showAll? filteredEmployees : filteredEmployees.slice(0, 10)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="text-foreground p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6 rounded-lg border bg-card p-4">
            <div>
              <p className="text-sm text-primary">Employee</p>
              <h1 className="text-2xl font-bold">Employee Records Management</h1>
            </div>
            <Button asChild>
              <Link href="/employees/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Link>
            </Button>
          </div>

          <div className="rounded-lg border bg-card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Employee Master Database</h2>
            
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Dept" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Depts</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
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
                variant={statusFilter === "active"? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "inactive"? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("inactive")}
              >
                Inactive
              </Button>
              <Button
                variant={deptFilter!== "all"? "default" : "outline"}
                size="sm"
                onClick={() => setDeptFilter(deptFilter === "all"? departments[0] : "all")}
              >
                By Department
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
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      Loading...
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
                        {emp.imageUrl? (
                          <img
                            src={emp.imageUrl}
                            alt={emp.firstName}
                            className="h-10 w-10 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm">
                            {emp.firstName[0]}{emp.lastName[0]}
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
                          {emp.status.replace("_", " ")}
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