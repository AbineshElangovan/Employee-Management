"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, UserCheck, UserX, Calendar, Building2, TrendingUp, ArrowRight } from "lucide-react"

interface RecentEmployee {
  id: string
  firstName: string
  lastName: string
  designation: string
  department: string
  joiningDate: string
  profileImage?: string
  Image?: string
  image?: string
}

interface DepartmentSummary {
  department: string
  count: number
  percentage: number
}

interface DashboardData {
  totalEmployees: number
  activeEmployees: number
  inactiveEmployees: number
  employeesOnLeave: number
  totalDepartments: number
  averageAttendance: number
  recentEmployees: RecentEmployee[]
  departmentSummary: DepartmentSummary[]
}

const PIE_COLORS = [
  "#a855f7", // purple
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // orange
  "#ef4444", // red
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange-2
  "#06b6d4", // cyan
  "#84cc16" // lime
]

export default function HomePage() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [hoveredDept, setHoveredDept] = useState<{ name: string; count: number; color: string; x: number; y: number } | null>(null)

  useEffect(() => {
    fetch("/api/dashboard")
.then(res => res.json())
.then((result) => {
        const sorted = {
...result,
          recentEmployees: result.recentEmployees
 .sort((a: RecentEmployee, b: RecentEmployee) => 
              new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime()
            )
 .slice(0, 7)
        }
        setData(sorted)
        setLoading(false)
      })
.catch(() => setLoading(false))
  }, [])

  if (loading ||!data) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </>
    )
  }

  let cumulativePercent = 0
  const pieSegments = data.departmentSummary.map((dept, idx) => {
    const startPercent = cumulativePercent
    cumulativePercent += dept.percentage
    const startAngle = (startPercent / 100) * 360 - 90
    const endAngle = (cumulativePercent / 100) * 360 - 90
    const midAngle = (startAngle + endAngle) / 2
    const largeArc = dept.percentage > 50? 1 : 0
    
    const startX = 200 + 120 * Math.cos((startAngle * Math.PI) / 180)
    const startY = 200 + 120 * Math.sin((startAngle * Math.PI) / 180)
    const endX = 200 + 120 * Math.cos((endAngle * Math.PI) / 180)
    const endY = 200 + 120 * Math.sin((endAngle * Math.PI) / 180)
    
    const labelRadius = 165
    const labelX = 200 + labelRadius * Math.cos((midAngle * Math.PI) / 180)
    const labelY = 200 + labelRadius * Math.sin((midAngle * Math.PI) / 180)
    
    const lineEndX = 200 + 125 * Math.cos((midAngle * Math.PI) / 180)
    const lineEndY = 200 + 125 * Math.sin((midAngle * Math.PI) / 180)
    
    const color = PIE_COLORS[idx % PIE_COLORS.length]
    
    return {
...dept,
      color,
      path: `M 200 200 L ${startX} ${startY} A 120 120 0 ${largeArc} 1 ${endX} ${endY} Z`,
      lineX1: lineEndX,
      lineY1: lineEndY,
      lineX2: labelX,
      lineY2: labelY,
      labelX: labelX + (labelX > 200? 8 : -8),
      labelY,
      textAnchor: labelX > 200? 'start' : 'end'
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                  <p className="text-2xl font-bold">{data.totalEmployees}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <UserCheck className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Employees</p>
                  <p className="text-2xl font-bold">{data.activeEmployees}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <UserX className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inactive Employees</p>
                  <p className="text-2xl font-bold">{data.inactiveEmployees}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employees On Leave</p>
                  <p className="text-2xl font-bold">{data.employeesOnLeave}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Building2 className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Departments</p>
                  <p className="text-2xl font-bold">{data.totalDepartments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-cyan-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Attendance</p>
                  <p className="text-2xl font-bold">{data.averageAttendance}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Employees</CardTitle>
              <Link href="/employees">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-primary"
                >
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.recentEmployees.map((emp) => (
                <div 
                  key={emp.id} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => router.push(`/employees/${emp.id}`)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={emp.profileImage || emp.Image || emp.image || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {emp.firstName[0]}{emp.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {emp.firstName} {emp.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {emp.designation}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{emp.department}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined: {new Date(emp.joiningDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <svg viewBox="0 0 400 400" className="w-full max-w-[400px] h-auto mx-auto">
                  {pieSegments.map((segment) => (
                    <g key={segment.department}>
                      <path
                        d={segment.path}
                        fill={segment.color}
                        stroke="hsl(var(--background))"
                        strokeWidth="2"
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onMouseMove={(e) => {
                          const rect = e.currentTarget.ownerSVGElement!.getBoundingClientRect()
                          setHoveredDept({
                            name: segment.department,
                            count: segment.count,
                            color: segment.color,
                            x: e.clientX - rect.left,
                            y: e.clientY - rect.top
                          })
                        }}
                        onMouseLeave={() => setHoveredDept(null)}
                      />
                      <line
                        x1={segment.lineX1}
                        y1={segment.lineY1}
                        x2={segment.lineX2}
                        y2={segment.lineY2}
                        stroke={segment.color}
                        strokeWidth="2"
                      />
                      <circle
                        cx={segment.lineX2}
                        cy={segment.lineY2}
                        r="4"
                        fill={segment.color}
                      />
                      <text
                        x={segment.labelX}
                        y={segment.labelY}
                        textAnchor={segment.textAnchor}
                        dominantBaseline="middle"
                        className="text-xs fill-foreground"
                      >
                        {segment.department}
                      </text>
                    </g>
                  ))}
                </svg>
                
                {hoveredDept && (
                  <div 
                    className="absolute pointer-events-none bg-popover text-popover-foreground border rounded-lg shadow-lg px-4 py-2 z-10"
                    style={{ left: hoveredDept.x + 15, top: hoveredDept.y - 40 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: hoveredDept.color }} />
                      <ArrowRight className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-semibold text-sm">{hoveredDept.name}</p>
                        <p className="text-xs text-muted-foreground">{hoveredDept.count} Employees</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}