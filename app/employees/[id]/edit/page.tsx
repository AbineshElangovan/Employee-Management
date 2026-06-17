"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/forms"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft, Save, Upload, X } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

const editSchema = z.object({
  employeeId: z.string().optional(),
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone"),
  address: z.string().min(1, "Required"),
  department: z.string().min(1, "Required"),
  designation: z.string().optional(),
  joiningDate: z.string().min(1, "Required"),
  salary: z.number().gt(0, "Must be greater than 0"),
  status: z.enum(["active", "inactive", "on_leave"]),
  attendancePercentage: z.number().min(0).max(100).optional(),
  imageUrl: z.string().optional(),
})

type EditForm = z.infer<typeof editSchema>

export default function EmployeeEditPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")

  const form = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      employeeId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      department: "",
      designation: "",
      joiningDate: "",
      salary: 0,
      status: "active",
      attendancePercentage: 0,
      imageUrl: "",
    },
  })

  useEffect(() => {
    if (!id) return
    fetch(`/api/employee/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found")
        return res.json()
      })
      .then((data) => {
        form.reset({
          employeeId: data.employeeId || "",
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          department: data.department,
          designation: data.designation || "",
          joiningDate: data.joiningDate,
          salary: data.salary,
          status: data.status,
          attendancePercentage: data.attendancePercentage ?? 0,
          imageUrl: data.imageUrl || "",
        })
        if (data.imageUrl) setImagePreview(data.imageUrl)
      })
      .catch(() => toast.error("Failed to load employee"))
      .finally(() => setLoading(false))
  }, [id, form])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setImagePreview(base64)
      form.setValue("imageUrl", base64)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview("")
    form.setValue("imageUrl", "")
  }

  const onSubmit = async (values: EditForm) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/employee/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error()
      toast.success("Employee updated successfully")
      router.push(`/employees/${id}/view`)
    } catch {
      toast.error("Failed to update employee")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Employee</p>
            <h1 className="text-2xl md:text-3xl font-bold">Edit Employee</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">

              {/* Personal Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Employee ID
                          <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            Auto Generated
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            readOnly
                            className="bg-muted cursor-not-allowed font-mono tracking-wider"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Professional Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Professional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["Development", "Sales", "HR", "Marketing", "Finance", "Design", "IT", "Cyber Security"].map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary (Monthly ₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="numeric"
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
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="attendancePercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attendance %</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="numeric"
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
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="on_leave">On Leave</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="joiningDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Joining Date</FormLabel>
                        <FormControl><Input type="date" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={() => (
                      <FormItem>
                        <FormLabel>Profile Image</FormLabel>
                        <FormControl>
                          <div>
                            {imagePreview ? (
                              <div className="relative w-24 h-24">
                                <Image
                                  src={imagePreview}
                                  alt="Preview"
                                  width={96}
                                  height={96}
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
                              <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                                <div className="text-center">
                                  <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                                  <span className="text-xs text-muted-foreground">Upload</span>
                                </div>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                              </label>
                            )}
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  )
}