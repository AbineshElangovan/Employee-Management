"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/src/components/ui/forms";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/src/components/ui/select";


const employeeSchema = z.object({
  employeeId: z
    .string()
    .min(1, "Employee ID is required")
    .regex(/^[A-Za-z0-9-_]+$/, "Only letters, numbers, hyphens and underscores allowed"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  status: z.enum(["Active", "Inactive", "On Leave"], {
    required_error: "Status is required",
  }),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
export interface EmployeeDefaultValues {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  department?: string | null;
  position?: string | null;
  status: string;
}



type EmployeeFormProps =
  | {
      mode: "add";
      onSubmit: (values: EmployeeFormValues) => Promise<void> | void;
      isLoading?: boolean;
      defaultValues?: never;
    }
  | {
      mode: "edit";
      defaultValues: EmployeeDefaultValues;
      onSubmit: (values: EmployeeFormValues) => Promise<void> | void;
      isLoading?: boolean;
    };



const STATUS_OPTIONS = ["Active", "Inactive", "On Leave"] as const;



export function EmployeeForm({
  mode,
  onSubmit,
  isLoading = false,
  defaultValues,
}: EmployeeFormProps) {
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues:
      mode === "edit" && defaultValues
        ? {
            employeeId: defaultValues.employeeId,
            firstName: defaultValues.firstName,
            lastName: defaultValues.lastName,
            email: defaultValues.email,
            phone: defaultValues.phone ?? "",
            department: defaultValues.department ?? "",
            position: defaultValues.position ?? "",
            status: (defaultValues.status as EmployeeFormValues["status"]) ?? "Active",
          }
        : {
            employeeId: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            department: "",
            position: "",
            status: "Active",
          },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Row 1 — IDs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="EMP-001"
                    disabled={mode === "edit"} 
                    {...field}
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

      
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

      
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="jane@company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phone{" "}
                  <span className="text-muted-foreground text-xs">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1 555 000 0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

    
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Department{" "}
                  <span className="text-muted-foreground text-xs">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Engineering" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Position{" "}
                  <span className="text-muted-foreground text-xs">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Senior Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? mode === "add"
              ? "Adding employee…"
              : "Saving changes…"
            : mode === "add"
            ? "Add Employee"
            : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}