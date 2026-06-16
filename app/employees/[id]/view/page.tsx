"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Loader2, ArrowLeft, Mail, Phone, MapPin,
  Briefcase, Building2, Calendar, IndianRupee,
  IdCard, Activity, Trash2, Pencil,
} from "lucide-react"
import { toast } from "sonner"
import { getEmployee, deleteEmployee, type Employee } from "@/lib/db-actions"
import { useEmployeeStore } from "@/app/store/EmployeeStore"

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return { label: "Active", className: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30", dot: "bg-emerald-500" }
    case "on_leave":
      return { label: "On Leave", className: "bg-amber-500/20 text-amber-500 border-amber-500/30", dot: "bg-amber-500" }
    default:
      return { label: "Inactive", className: "bg-red-500/20 text-red-500 border-red-500/30", dot: "bg-red-500" }
  }
}

export default function EmployeeViewPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const { deleteEmployee: removeFromStore } = useEmployeeStore()

  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!id) return
    getEmployee(id)
      .then((data) => setEmployee(data))
      .catch(() => toast.error("Failed to load employee"))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!employee) return
    if (!confirm(`Delete ${employee.firstName} ${employee.lastName}? This cannot be undone.`)) return
    setDeleting(true)
    const result = await deleteEmployee(id)
    if (result.success) {
      removeFromStore(id)
      toast.success("Employee deleted")
      router.push("/employees")
    } else {
      toast.error("Failed to delete employee")
      setDeleting(false)
    }
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

  if (!employee) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4">
          <p className="text-muted-foreground">Employee not found.</p>
          <Button variant="outline" onClick={() => router.push("/employees")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Employees
          </Button>
        </div>
      </div>
    )
  }

  const badge = getStatusBadge(employee.status)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Employee</p>
            <h1 className="text-2xl md:text-3xl font-bold">Employee Profile</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/employees")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left card */}
          <Card className="lg:col-span-1">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
              <div className="h-40 w-40 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                {employee.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={employee.imageUrl}
                    alt={employee.firstName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-semibold text-muted-foreground">
                    {employee.firstName[0]}{employee.lastName[0]}
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  {employee.firstName} {employee.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {employee.designation || "—"}
                </p>
              </div>

              <Badge className={`gap-1.5 ${badge.className}`}>
                <span className={`h-2 w-2 rounded-full ${badge.dot}`} />
                {badge.label}
              </Badge>

              <Separator />

              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <IdCard className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Employee ID</span>
                  <span className="ml-auto font-medium">{employee.employeeId}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{employee.email}</span>
                </div>
                {employee.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{employee.phone}</span>
                  </div>
                )}
                {employee.address && (
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span>{employee.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right cards */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs">Department</p>
                    <p className="font-medium">{employee.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs">Designation</p>
                    <p className="font-medium">{employee.designation || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <IndianRupee className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs">Salary (Monthly)</p>
                    <p className="font-medium">₹{employee.salary?.toLocaleString("en-IN")}</p>
                  </div>
                </div>
                {employee.joiningDate && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-muted-foreground text-xs">Joining Date</p>
                      <p className="font-medium">
                        {new Date(employee.joiningDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status &amp; Performance</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 text-sm">
                  <Activity className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs">Attendance</p>
                    <p className="font-medium">{employee.attendancePercentage ?? 0}% (Monthly Avg)</p>
                  </div>
                </div>
                {employee.updatedAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-muted-foreground text-xs">Last Updated</p>
                      <p className="font-medium">
                        {new Date(employee.updatedAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href={`/employees/${id}/edit`}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Employee
                </Link>
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                {deleting
                  ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  : <Trash2 className="h-4 w-4 mr-2" />
                }
                Delete Employee
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}