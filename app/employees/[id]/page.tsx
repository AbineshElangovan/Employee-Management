"use client"

import { useParams, useRouter } from "next/navigation"
import { useEmployeeStore } from "../../store/EmployeeStore"
import { Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function EmployeeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { employees, deleteEmployee } = useEmployeeStore()

  const employee = employees.find((e) => e.id === params.id)

  if (!employee) return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      Employee not found
    </div>
  )

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee(employee.id)
      router.push("/employees")
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <Card className="mb-6 bg-card/60 border-border backdrop-blur-sm">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Records Management:</h1>
            </div>
    
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
         
          <Card className="overflow-hidden bg-card/60 border-border backdrop-blur-sm">
            <img
              src={employee.Image}
              alt={`${employee.firstName} ${employee.lastName}`}
              className="h-[600px] w-full object-cover"
            />
          </Card>

          {/* Right - Details */}
          <Card className="bg-card/60 border-border backdrop-blur-sm">
            <CardContent className="p-8">
              <h1 className="mb-6 text-xl font-semibold text-foreground">Profile Details:</h1>

              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <h3 className="mb-3 text-sm font-medium text-primary">Personal information</h3>
                  <p className="text-sm text-muted-foreground">
                    Full Name: <span className="text-foreground">{employee.firstName} {employee.lastName}</span>
                  </p>
                  <div className="mt-4">
                    <p className="mb-2 text-sm text-muted-foreground">Profile Picture</p>
                    <img src={employee.Image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-primary">Professional Details</h3>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-muted-foreground">Employee ID: <span className="text-foreground">{employee.employeeId}</span></p>
                    <p className="text-muted-foreground">Position: <span className="text-foreground">{employee.designation}</span></p>
                    <p className="text-muted-foreground">Department: <span className="text-foreground">{employee.department}</span></p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-primary">Contact Details</h3>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-muted-foreground">Email: <span className="text-foreground">{employee.email}</span></p>
                    <p className="text-muted-foreground">Phone: <span className="text-foreground">{employee.phone}</span></p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-primary">Location</h3>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-muted-foreground">Address: <span className="text-foreground">{employee.address}</span></p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-primary">Employment Records</h3>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-muted-foreground">Joining Date: <span className="text-foreground">{employee.joiningDate}</span></p>
                    <p className="text-muted-foreground">Salary: <span className="text-foreground">₹{employee.salary.toLocaleString('en-IN')}</span></p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-primary">Status & Performance</h3>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-muted-foreground">
                      Status: <span className="inline-flex items-center gap-1.5 text-green-500">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        {employee.status}
                      </span>
                    </p>
                    <p className="text-muted-foreground">Attendance: <span className="text-foreground">{employee.attendancePercentage}%</span></p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  className="w-full gap-2"
                >
                  <Trash2 size={16} />
                  Delete Employee
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}