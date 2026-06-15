"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, UserCheck, UserX, DollarSign, Loader2, Database } from "lucide-react"
import Link from "next/link"

type DashboardData = {
  totalEmployees: number
  activeEmployees: number
  onLeaveEmployees: number
  departmentSummary: { name: string; value: number; percentage: number }[]
  averageSalary: number
  recentEmployees: any[]
}

export default function HomePage() {
  const [data, setData] = useState<DashboardData>({
    totalEmployees: 0,
    activeEmployees: 0,
    onLeaveEmployees: 0,
    departmentSummary: [],
    averageSalary: 0,
    recentEmployees: [],
  })

  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)

  const fetchData = async () => {
    setLoading(true)

    try {
      const res = await fetch("/api/dashboard")
      const json = await res.json()

      console.log("Dashboard Response:", json)

      setData({
        totalEmployees: json.totalEmployees ?? 0,
        activeEmployees: json.activeEmployees ?? 0,
        onLeaveEmployees: json.onLeaveEmployees ?? 0,
        departmentSummary: json.departmentSummary ?? [],
        averageSalary: json.averageSalary ?? 0,
        recentEmployees: json.recentEmployees ?? [],
      })
    } catch (err) {
      console.error("Fetch failed:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSeed = async () => {
    setSeeding(true)

    await fetch("/api/seed")

    await fetchData()

    setSeeding(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          <Card>
            <CardHeader>
              <CardTitle>Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.totalEmployees}
              </div>
              <Link href="/employees">View all</Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.activeEmployees}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>On Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.onLeaveEmployees}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Salary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{Number(data.averageSalary ?? 0).toLocaleString("en-IN")}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}