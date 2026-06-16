import db from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pencil, ArrowLeft } from "lucide-react"

type Employee = {
  id: string
  firstName: string
  lastName: string
  email: string
  employeeId: string
  department: string
  designation?: string
  salary: number
  status: "Active" | "Inactive" | "On Leave"
}

async function getEmployee(id: string): Promise<Employee | null> {
  try {
    const stmt = db.prepare("SELECT * FROM employees WHERE id =?")
    const employee = stmt.get(id) as Employee | undefined
    return employee || null
  } catch (error) {
    console.error("DB Error:", error)
    return null
  }
}

export default async function ViewEmployeePage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const employee = await getEmployee(params.id)
  
  if (!employee) {
    notFound()
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/employees">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/employees/${params.id}/edit`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h1 className="text-2xl font-bold mb-6">
          {employee.firstName} {employee.lastName}
        </h1>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Employee ID</p>
            <p className="font-medium">{employee.employeeId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{employee.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Department</p>
            <p className="font-medium">{employee.department}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Designation</p>
            <p className="font-medium">{employee.designation || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Salary</p>
            <p className="font-medium">₹{employee.salary.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium">{employee.status}</p>
          </div>
        </div>
      </div>
    </div>
  )
}