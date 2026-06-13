"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Loader2, Search, Eye, Pencil } from "lucide-react"
import { Employee } from "@/app/types/employee"

export default function EmployeesPage() {
  const router = useRouter()
  const [employees, setEmployees] = React.useState<Employee[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [deptFilter, setDeptFilter] = React.useState("all")
  const [visibleCount, setVisibleCount] = React.useState(10)

  React.useEffect(() => {
    fetch("/api/employees")
   .then(res => res.json())
   .then((data: Employee[]) => {
        const empData = Array.isArray(data)? data : []
        setEmployees(empData)
        setLoading(false)
      })
   .catch(() => {
        setEmployees([])
        setLoading(false)
      })
  }, [])

  const departments = React.useMemo(() => {
    const depts = new Set(employees.map(e => e.department).filter(Boolean))
    return Array.from(depts)
  }, [employees])

  const filtered = React.useMemo(() => {
    let result = employees

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(emp =>
        emp.employeeId?.toLowerCase().includes(term) ||
        emp.firstName?.toLowerCase().includes(term) ||
        emp.lastName?.toLowerCase().includes(term) ||
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(term) ||
        emp.department?.toLowerCase().includes(term)
      )
    }

    if (deptFilter!== "all") {
      result = result.filter(emp => emp.department === deptFilter)
    }

    return result
  }, [searchTerm, deptFilter, employees])

  const visibleEmployees = filtered.slice(0, visibleCount)

  if (loading) return (
    <>
      <Header />
      <div className="p-6 flex items-center justify-center min-h-[400px] bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </>
  )

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Employee Records Management</h1>
            <p className="text-muted-foreground">Employee Master Database</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID, Name, Department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value?? "")}
                    className="pl-10"
                  />
                </div>
                <Select value={deptFilter} onValueChange={(value) => setDeptFilter(value)}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profile Photo</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleEmployees.length === 0? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No employees found
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleEmployees.map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell>
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={emp.profileImage || emp.Image || emp.image || ""}
                              alt={`${emp.firstName} ${emp.lastName}`}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {emp.firstName?.[0]}{emp.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{emp.employeeId}</TableCell>
                        <TableCell className="font-medium">{emp.firstName} {emp.lastName}</TableCell>
                        <TableCell>{emp.department}</TableCell>
                        <TableCell>{emp.designation}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/employees/${emp.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/edit-employee/${emp.id}`)}
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {filtered.length > visibleCount && (
                <div className="p-4 text-center border-t">
                  <Button
                    variant="outline"
                    onClick={() => setVisibleCount(prev => prev + 10)}
                  >
                    Show More ({filtered.length - visibleCount} remaining)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}