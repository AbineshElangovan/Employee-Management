"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Building2, Users } from "lucide-react"

type Department = {
  department: string
  employeeCount: number
}

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/departments")
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data.departments || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }, [])

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
          <h1 className="text-2xl font-bold">
            Department Management
          </h1>

          <p className="text-muted-foreground">
            View department wise employee count
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <Card key={dept.department}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {dept.department}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />

                  <span className="text-lg font-semibold">
                    {dept.employeeCount} Employees
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}