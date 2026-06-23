"use client"

import { Inter, Geist } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { Moon, Sun, UserPlus, Users, CalendarCheck, Building2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const inter = Inter({ subsets: ["latin"] })

function Header() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4 gap-4">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Dashboard</span>
          <span className="text-lg font-bold">Welcome back, HR Manager</span>
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

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col gap-6 px-4 py-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <span className="text-lg font-bold">EMS</span>
          <p className="text-sm text-muted-foreground max-w-xs">
            Employee Management System — streamlined records, attendance, and
            reporting for growing teams.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm sm:flex sm:gap-12">
          <div className="space-y-2">
            <p className="font-medium text-foreground">Company</p>
            <p className="text-muted-foreground">EMS Technologies Pvt. Ltd.</p>
            <p className="text-muted-foreground">Coimbatore, Tamil Nadu, India</p>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-foreground">Contact</p>
            <p className="text-muted-foreground">support@ems-app.com</p>
            <p className="text-muted-foreground">+91 98765 43210</p>
          </div>
        </div>
      </div>

      <div className="border-t px-4 py-4 text-center text-xs text-muted-foreground">
        © {year} EMS Technologies Pvt. Ltd. All rights reserved.
      </div>
    </footer>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={cn(inter.className, "min-h-screen flex flex-col")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}