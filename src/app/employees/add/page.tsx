"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/forms"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Sparkles, Upload, X } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { createEmployee } from "@/lib/db-actions"
import { useEmployeeStore } from "@/app/store/EmployeeStore"

const employeeSchema = z.object({
  firstName: z.string().min(3, "First Name must contain at least 3 characters"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(10, "Phone number must be valid").min(10, "Phone number must be valid"),
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

export default function AddEmployeePage() {
  const router = useRouter()
  const { addEmployee } = useEmployeeStore()
  const [imagePreview, setImagePreview] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [idLoading, setIdLoading] = useState(true)

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      employeeId: "",
      department: "",
      designation: "",
      joiningDate: new Date().toISOString().split("T")[0],
      salary: 0,
      imageUrl: "",
      status: "active",
      attendancePercentage: 0,
    },
  })


  useEffect(() => {
    setIdLoading(true)
    fetch("/api/employee/next-id")
      .then((res) => res.json())
      .then((data) => {
        if (data.employeeId) {
          form.setValue("employeeId", data.employeeId)
        }
      })
      .catch(() => toast.error("Could not generate Employee ID"))
      .finally(() => setIdLoading(false))
  }, [form])

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
    setLoading(true)
    const result = await createEmployee(values)

    if (result.success && result.data) {
      addEmployee(result.data)
      toast.success("Employee added successfully")
      router.push(`/employees?new=${result.data.id}`)
    } else {
      toast.error(result.error || "Failed to create employee")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="text-foreground p-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/employees" className="inline-flex items-center text-sm text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employees
          </Link>

          <h1 className="text-3xl font-bold mb-2">Add New Employee</h1>
          <p className="text-muted-foreground mb-6">
            Create and initialize a secure digital record for new personnel entry.
          </p>

          <div className="mb-6 rounded-lg border border-primary/40 bg-primary/10 p-4">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">
                Form Validator Active: Input real-time evaluation rules applied down below.
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Personal Details */}
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="text-lg font-semibold text-primary mb-5">1. PERSONAL DETAILS</h2>

                  <FormField control={form.control} name="firstName" render={({ field, fieldState }) => (
                    <FormItem className="mb-4">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" className={fieldState.error ? "border-destructive" : ""} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="lastName" render={({ field, fieldState }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" className={fieldState.error ? "border-destructive" : ""} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="email" render={({ field, fieldState }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@gmail.com" className={fieldState.error ? "border-destructive" : ""} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="phone" render={({ field, fieldState }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" className={fieldState.error ? "border-destructive" : ""} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="address" render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Home Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Chennai, Tamil Nadu" className={fieldState.error ? "border-destructive" : ""} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Employment Parameters */}
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="text-lg font-semibold text-primary mb-5">2. EMPLOYMENT PARAMETERS</h2>

                  {/* Auto-generated Employee ID */}
                  <FormField control={form.control} name="employeeId" render={({ field, fieldState }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="flex items-center gap-2">
                        Employee ID
                        <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          Auto Generated
                        </span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="EMP022"
                            readOnly
                            className={`bg-muted cursor-not-allowed font-mono tracking-wider ${
                              fieldState.error ? "border-destructive" : ""
                            }`}
                            {...field}
                          />
                          {idLoading && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Spinner className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="department" render={({ field, fieldState }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Assigned Corporate Department</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={fieldState.error ? "border-destructive" : ""}>
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
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="Cyber Security">Cyber Security</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="designation" render={({ field, fieldState }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Designation <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Software Engineer" className={fieldState.error ? "border-destructive" : ""} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="joiningDate" render={({ field, fieldState }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Official Joining Date</FormLabel>
                      <FormControl>
                        <Input type="date" className={fieldState.error ? "border-destructive" : ""} {...field} />
                      </FormControl>
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
                          placeholder="50000"
                          className={fieldState.error ? "border-destructive" : ""}
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "")
                            field.onChange(val ? Number(val) : 0)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              {/* Profile Context Details */}
              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-lg font-semibold text-primary mb-5">3. PROFILE CONTEXT DETAILS</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <FormField control={form.control} name="imageUrl" render={() => (
                    <FormItem>
                      <FormLabel>Profile Image</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          {imagePreview ? (
                            <div className="relative w-32 h-32">
                              <Image
                                src={imagePreview}
                                alt="Preview"
                                width={128}
                                height={128}
                                className="object-cover rounded-lg border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                onClick={removeImage}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <label
                              htmlFor="image-upload"
                              className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 border-border"
                            >
                              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                              <span className="text-xs text-muted-foreground">Upload</span>
                              <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                              />
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
                          <SelectTrigger className={fieldState.error ? "border-destructive" : ""}>
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
                          placeholder="85"
                          className={fieldState.error ? "border-destructive" : ""}
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "")
                            field.onChange(val ? Number(val) : 0)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel Process
                </Button>
                <Button type="submit" disabled={loading || idLoading}>
                  {loading && <Spinner className="mr-2" />}
                  {loading ? "Adding..." : "Add Employee"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
