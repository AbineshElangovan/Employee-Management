"use client"

import Link from "next/link"
import { useMemo, useState, useTransition } from "react"
import { MoreHorizontal, Plus, Search } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"

import { deleteEmployee, type Employee } from "@/src/actions/employees"
import { STATUS_BADGE_VARIANT, STATUS_LABELS } from "@/src/lib/employee-schema"

export function EmployeeTable({ employees }: { employees: Employee[] }) {
  const [query, setQuery] = useState("")
  const [pendingDelete, setPendingDelete] = useState<Employee | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return employees
    return employees.filter((e) =>
      [e.firstName, e.lastName, e.employeeId, e.email, e.department]
        .join(" ")
        .toLowerCase()
        .includes(q)
    )
  }, [employees, query])

  function confirmDelete() {
    if (!pendingDelete) return
    const target = pendingDelete
    startTransition(async () => {
      const result = await deleteEmployee(target.id)
      if (result.success) {
        toast.success(`Removed ${target.firstName} ${target.lastName}`)
      } else {
        toast.error(result.error || "Couldn't remove employee")
      }
      setPendingDelete(null)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, email, department"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button asChild>
          <Link href="/employees/new">
            <Plus className="mr-2 h-4 w-4" />
            Add employee
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  {employees.length === 0
                    ? "No employees yet. Add your first one to get started."
                    : "No employees match your search."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <Link
                      href={`/employees/${employee.id}/view`}
                      className="flex items-center gap-3 hover:underline"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={employee.imageUrl ?? undefined} />
                        <AvatarFallback>
                          {employee.firstName[0]}
                          {employee.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium leading-none">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {employee.employeeId}
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_BADGE_VARIANT[employee.status]}>
                      {STATUS_LABELS[employee.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {employee.attendancePercentage ?? 0}%
                  </TableCell>
                  <TableCell>
                    {new Date(employee.joiningDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/employees/${employee.id}/view`}>
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/employees/${employee.id}/edit`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setPendingDelete(employee)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this employee?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete &&
                `This will permanently remove ${pendingDelete.firstName} ${pendingDelete.lastName} (${pendingDelete.employeeId}) from your records. This can't be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}