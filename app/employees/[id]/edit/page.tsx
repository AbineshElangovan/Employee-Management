"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, ArrowRight } from "lucide-react"

interface Employee {
  id: string
  imageUrl?: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  designation: string
  salary: number
  status: "active" | "inactive" | "on_leave"
  attendancePercentage: number
  address: string
  joiningDate: string
}

const DEPARTMENTS = ["Development", "HR", "Marketing", "Sales", "Finance", "Operations"]
const STATUSES: { value: Employee["status"]; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "on_leave", label: "On Leave" },
]

export default function EditEmployeePage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [original, setOriginal] = useState<Employee | null>(null)
  const [form, setForm] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchEmployee = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/employees/${id}`)
        if (!res.ok) {
          throw new Error("Employee not found")
        }
        const data = await res.json()
        setOriginal(data)
        setForm(data)
      } catch (err) {
        console.error(err)
        setError("Employee not found")
      } finally {
        setLoading(false)
      }
    }

    fetchEmployee()
  }, [id])

  const handleChange = (field: keyof Employee, value: string | number) => {
    if (!form) return
    setForm({ ...form, [field]: value })
  }

  const handleSubmit = async () => {
    if (!form) return
    try {
      setSaving(true)
      const res = await fetch(`/api/employees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to update employee")
      router.push(`/employees/${id}`)
    } catch (err) {
      console.error(err)
      setError("Failed to update employee")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-12">
          <p className="text-destructive">{error || "Employee not found"}</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/employees")}>
            Back to Employees
          </Button>
        </div>
      </div>
    )
  }

  const designationChanged = original && original.designation !== form.designation

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Employee</h1>
          <p className="text-sm text-muted-foreground">Update existing employee information.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Details */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Employment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input id="employeeId" value={form.employeeId} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select
                  value={form.department}
                  onValueChange={(value) => handleChange("department", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={form.designation || ""}
                  onChange={(e) => handleChange("designation", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Input
                  id="joiningDate"
                  type="date"
                  value={form.joiningDate}
                  onChange={(e) => handleChange("joiningDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  value={form.salary}
                  onChange={(e) => handleChange("salary", Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Profile Image URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="Paste image URL"
                  value={form.imageUrl || ""}
                  onChange={(e) => handleChange("imageUrl", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => handleChange("status", value as Employee["status"])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendancePercentage">Attendance %</Label>
                <Input
                  id="attendancePercentage"
                  type="number"
                  min={0}
                  max={100}
                  value={form.attendancePercentage}
                  onChange={(e) => handleChange("attendancePercentage", Number(e.target.value))}
                />
              </div>

              {designationChanged && original && (
                <div className="space-y-2">
                  <CardDescription>Compare Changes</CardDescription>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-md border p-3 text-sm">
                      <p className="text-xs text-muted-foreground">Designation</p>
                      <p className="font-medium">{original.designation || "—"}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 rounded-md border border-primary bg-primary/5 p-3 text-sm">
                      <p className="text-xs text-muted-foreground">Designation</p>
                      <p className="font-medium">{form.designation || "—"}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => router.back()} disabled={saving}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Update Employee
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}