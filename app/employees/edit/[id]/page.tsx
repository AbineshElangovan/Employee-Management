"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/forms"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Sparkles, Upload, X, Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useEmployeeStore } from "@/app/store/EmployeeStore"

const employeeSchema = z.object({
  firstName: z.string().min(3, "First Name must contain at least 3 characters"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be valid"),
  address: z.string().min(5, "Home Address is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  department: z.string().min(1, "Department is required"),
  designation: z.string().optional(),
  joiningDate: z.string().min(1, "Joining date is required"),
  salary: z.number().gt(0, "Salary must be greater than 0"),
  imageUrl: z.string().optional(),
  status: z.enum(["active", "inactive", "on_leave"]),
  attendancePercentage: z.number().min(0).max(100).optional(),
})

type EmployeeFormValues = z.infer<typeof employeeSchema>

export default function EditEmployeePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { updateEmployee } = useEmployeeStore()
  const [imagePreview, setImagePreview] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    mode: "onChange",
  })

  useEffect(() => {
    fetchEmployee()
  }, [params.id])

  const fetchEmployee = async () => {
    try {
      const res = await fetch(`/api/employees/${params.id}`)
      if (!res.ok) throw new Error("Not found")
      const employee = await res.json()

      form.reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        address: employee.address,
        employeeId: employee.employeeId,
        department: employee.department,
        designation: employee.designation || "",
        joiningDate: employee.joiningDate.split('T')[0],
        salary: employee.salary,
        imageUrl: employee.imageUrl || "",
        status: employee.status,
        attendancePercentage: employee.attendancePercentage || 85,
      })

      if (employee.imageUrl) setImagePreview(employee.imageUrl)
    } catch (error) {
      toast.error("Employee not found")
      router.push("/employees")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setImagePreview(base64String)
        form.setValue("imageUrl", base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview("")
    form.setValue("imageUrl", "")
  }

  const onSubmit = async (values: EmployeeFormValues) => {
    try {
      setSaving(true)
      const res = await fetch(`/api/employees/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error("Failed to update")

      const updatedEmployee = await res.json()
      updateEmployee(params.id, updatedEmployee)
      toast.success("Employee updated successfully")
      router.push("/employees")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
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
      <div className="text-foreground p-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/employees" className="inline-flex items-center text-sm text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employees
          </Link>

          <h1 className="text-3xl font-bold mb-2">Edit Employee</h1>
          <p className="text-muted-foreground mb-6">Update employee record details.</p>

          <div className="mb-6 rounded-lg border border-primary/40 bg-primary/10 p-4">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Form Validator Active: Input real-time evaluation rules applied down below.</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="text-lg font-semibold text-primary mb-5">1. PERSONAL DETAILS</h2>

                  <FormField control={form.control} name="firstName" render={({ field, fieldState }) => (
                    <FormItem className="mb-4">
                      <FormLabel>First Name</FormLabel>
                      <FormControl><Input className={fieldState.error? "border-destructive" : ""} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="lastName" render={({ field, fieldState }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl><Input className={fieldState.error? "border-destructive" : ""} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="email" render={({ field, fieldState }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input type="email" className={fieldState.error? "border-destructive" : ""} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="phone" render={({ field, fieldState }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input className={fieldState.error? "border-destructive" : ""} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="address" render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Home Address</FormLabel>
                      <FormControl><Input className={fieldState.error? "border-destructive" : ""} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <h2 className="text-lg font-semibold text-primary mb-5">2. EMPLOYMENT PARAMETERS</h2>

                  <FormField control={form.control} name="employeeId" render={({ field, fieldState }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Employee ID (Unique Key)</FormLabel>
                      <FormControl><Input className={fieldState.error? "border-destructive" : ""} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="department" render={({ field, fieldState }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Assigned Corporate Department</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={fieldState.error? "border-destructive" : ""}>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Development">Development</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="designation" render={({ field, fieldState }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Designation</FormLabel>
                      <FormControl><Input placeholder="Software Engineer" className={fieldState.error? "border-destructive" : ""} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="joiningDate" render={({ field, fieldState }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Official Joining Date</FormLabel>
                      <FormControl><Input type="date" className={fieldState.error? "border-destructive" : ""} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="salary" render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Monthly Gross Salary (INR)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          className={fieldState.error? "border-destructive" : ""}
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "")
                            field.onChange(val? Number(val) : 0)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-lg font-semibold text-primary mb-5">3. PROFILE CONTEXT DETAILS</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <FormField control={form.control} name="imageUrl" render={() => (
                    <FormItem>
                      <FormLabel>Profile Image</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          {imagePreview? (
                            <div className="relative w-32 h-32">
                              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg border" />
                              <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={removeImage}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 border-border">
                              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                              <span className="text-xs text-muted-foreground">Upload</span>
                              <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="status" render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Operational Status Badge</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={fieldState.error? "border-destructive" : ""}>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="on_leave">On Leave</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="attendancePercentage" render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Attendance Percentage</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          className={fieldState.error? "border-destructive" : ""}
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "")
                            field.onChange(val? Number(val) : 0)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {saving? "Updating..." : "Update Employee"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}