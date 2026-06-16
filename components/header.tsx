"use client"

import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {Moon,Sun,UserPlus,Users,CalendarCheck,Building2,} from "lucide-react"
import { useEffect, useState } from "react"

export function Header() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4 gap-4">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">
            Dashboard
          </span>
          <span className="text-lg font-bold">
            Welcome back, HR Manager
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/employees/add")}
            className="hidden md:flex"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/employees")}
            className="hidden md:flex"
          >
            <Users className="h-4 w-4 mr-2" />
            Employee List
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/employees/attendance")}
            className="hidden md:flex"
          >
            <CalendarCheck className="h-4 w-4 mr-2" />
            Attendance
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/employees/department")}
            className="hidden md:flex"
          >
            <Building2 className="h-4 w-4 mr-2" />
            Departments
          </Button>

          {mounted ? (
            <div className="flex items-center bg-muted rounded-full p-1">
              <Button
                variant={theme === "light" ? "default" : "ghost"}
                size="icon"
                className="rounded-full h-8 w-8"
                onClick={() => setTheme("light")}
              >
                <Sun className="h-4 w-4" />
              </Button>

              <Button
                variant={theme === "dark" ? "default" : "ghost"}
                size="icon"
                className="rounded-full h-8 w-8"
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="h-10 w-[72px]" />
          )}
        </div>
      </div>
    </header>
  )
}