"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Users, UserCheck, UserX, Building2, UserMinus, Loader2, User } from "lucide-react"
import Link from "next/link"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { toast } from "sonner"

type DashboardData = {
  totalEmployees: number
  activeEmployees: number
  onLeaveEmployees: number
  departmentSummary: { name: string; value: number; percentage: number }[]
  averageSalary: number
  recentEmployees: any[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard")
        if (!res.ok) throw new Error("Failed to fetch")
        const json = await res.json()
        setData(json)
      } catch (error) {
        toast.error("Failed to load dashboard")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [])

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  const inactiveEmployees = data.totalEmployees - data.activeEmployees - data.onLeaveEmployees
  
  const recentByDate = [...data.recentEmployees]
    .sort((a, b) => new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime())
  
  const statusData = [
    { name: "Active", value: data.activeEmployees, color: "#3b82f6" },
    { name: "Inactive", value: inactiveEmployees, color: "#ef4444" },
    { name: "On Leave", value: data.onLeaveEmployees, color: "#f59e0b" }
  ].filter(d => d.value > 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Page Title: Dashboard</p>
            <h1 className="text-3xl font-bold">Welcome back, HR Manager</h1>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalEmployees}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <UserCheck className="h-4 w-4 text-emerald-500" />
                </div>
                <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.activeEmployees}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <UserMinus className="h-4 w-4 text-red-500" />
                </div>
                <CardTitle className="text-sm font-medium">Inactive Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inactiveEmployees}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <UserX className="h-4 w-4 text-amber-500" />
                </div>
                <CardTitle className="text-sm font-medium">Employees On Leave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.onLeaveEmployees}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Building2 className="h-4 w-4 text-purple-500" />
                </div>
                <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.departmentSummary.length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Employees</CardTitle>
                <Button asChild variant="link" size="sm">
                  <Link href="/employees">View All →</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {recentByDate.length === 0? (
                  <p className="text-center text-muted-foreground py-8">No employees in database.</p>
                ) : (
                  <div className="space-y-4">
                    {recentByDate.map((emp, idx) => (
                      <div key={emp.id}>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={emp.imageUrl || undefined} alt={emp.firstName} />
                            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                          </Avatar>
                          <div className="flex-1 grid grid-cols-3 items-center gap-4">
                            <div>
                              <p className="text-sm font-medium">{emp.firstName} {emp.lastName}</p>
                              <p className="text-xs text-muted-foreground">{emp.designation}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{emp.department}</p>
                            <p className="text-sm text-muted-foreground text-right">
                              Joined: {new Date(emp.joiningDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        {idx < recentByDate.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Department Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.departmentSummary.length === 0? (
                    <p className="text-center text-muted-foreground py-4">No departments found.</p>
                  ) : (
                    <div className="space-y-4">
                      {data.departmentSummary.map((dept, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{dept.name} {dept.value} Employees</span>
                            <span className="text-muted-foreground">{dept.percentage}%</span>
                          </div>
                          <Progress value={dept.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Employee Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.totalEmployees === 0? (
                    <p className="text-center text-muted-foreground py-4">No employee data.</p>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            dataKey="value"
                            stroke="none"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-2 mt-4">
                        {statusData.map((s, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                              <span>{s.name}</span>
                            </div>
                            <span className="text-muted-foreground">
                              {data.totalEmployees > 0 ? Math.round((s.value/data.totalEmployees)*100) : 0}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}