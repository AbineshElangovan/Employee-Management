"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import {Pagination,PaginationContent,PaginationEllipsis,PaginationItem,PaginationLink,PaginationNext,PaginationPrevious,} from "@/src/components/ui/pagination"
import { ArrowLeft, Pencil, Search, Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Employee } from "@/src/app/types/employee"
const PAGE_SIZE = 10



async function getToken(): Promise<string> {
  const cached = localStorage.getItem("token")
  if (cached) return cached

  const res = await fetch("/api/token")
  const data = await res.json()
  localStorage.setItem("token", data.token)
  return data.token
}

async function fetchWithAuth(url: string): Promise<Response> {
  const token = await getToken()
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (res.status === 401) {
    localStorage.removeItem("token")
    const freshToken = await getToken()
    return fetch(url, {
      headers: { Authorization: `Bearer ${freshToken}` },
    })
  }

  return res
}



export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [deptFilter, setDeptFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetchWithAuth("/api/employees")
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * PAGE_SIZE
  const displayEmployees = filtered.slice(startIndex, startIndex + PAGE_SIZE)

  const resetPage = () => setCurrentPage(1)

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    resetPage()
  }

  const handleDeptChange = (value: string) => {
    setDeptFilter(value ?? "all")
    resetPage()
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    resetPage()
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []
    const addPage = (p: number) => {
      if (!pages.includes(p)) pages.push(p)
    }

    addPage(1)
    if (safePage > 3) pages.push("ellipsis")
    for (let p = safePage - 1; p <= safePage + 1; p++) {
      if (p > 1 && p < totalPages) addPage(p)
    }
    if (safePage < totalPages - 2) pages.push("ellipsis")
    if (totalPages > 1) addPage(totalPages)

    return pages
  }

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
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={deptFilter} onValueChange={handleDeptChange}>
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
                  onClick={() => handleStatusChange(s)}
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
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No employees found.
                    </TableCell>
                  </TableRow>
                ) : (
                  displayEmployees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell>
                        {emp.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={emp.imageUrl}
                            alt={emp.firstName}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover border"
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

            {filtered.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, filtered.length)} of{" "}
                  {filtered.length}
                </p>

                <Pagination className="mx-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          goToPage(safePage - 1)
                        }}
                        className={safePage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>

                    {getPageNumbers().map((p, idx) =>
                      p === "ellipsis" ? (
                        <PaginationItem key={`ellipsis-${idx}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={p}>
                          <PaginationLink
                            href="#"
                            isActive={p === safePage}
                            onClick={(e) => {
                              e.preventDefault()
                              goToPage(p)
                            }}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          goToPage(safePage + 1)
                        }}
                        className={safePage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}