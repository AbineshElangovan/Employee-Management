import { create } from "zustand"
import { persist } from "zustand/middleware"
import { toast } from "sonner"

export type Employee = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  employeeId: string
  department: string
  designation: string
  joiningDate: string
  salary: number
  status: "Active" | "Inactive" | "On Leave"
  address: string
  attendancePercentage: number
  Image: string
}

export type EmployeeFormData = Omit<
  Employee,
  "id" | "Image" | "attendancePercentage"
> & {
  Image?: string
  attendancePercentage?: number
}

type SortField =
  | "firstName"
  | "lastName"
  | "joiningDate"
  | "salary"
  | "department"
  | "employeeId"
  | "status"

type SortOrder = "asc" | "desc"

type EmployeeStore = {
  employees: Employee[]

  addEmployee: (data: EmployeeFormData) => void
  updateEmployee: (id: string, data: EmployeeFormData) => void
  deleteEmployee: (id: string) => void
  getEmployeeById: (id: string) => Employee | undefined

  searchQuery: string
  setSearchQuery: (query: string) => void

  filterDepartment: string
  filterStatus: string
  setFilterDepartment: (dept: string) => void
  setFilterStatus: (status: string) => void

  sortField: SortField
  sortOrder: SortOrder
  setSort: (field: SortField, order: SortOrder) => void

  getFilteredEmployees: () => Employee[]
  seedData: () => void
}

export const useEmployeeStore = create<EmployeeStore>()(
  persist(
    (set, get) => ({
      employees: [],

      addEmployee: (data) => {
        const newEmployee: Employee = {
          ...data,
          id: crypto.randomUUID(),
          attendancePercentage:
            data.attendancePercentage ??
            Math.floor(Math.random() * 30) +
              70,
          Image:
            data.Image ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${data.firstName}${data.lastName}`,
        }

        set((state) => ({
          employees: [...state.employees, newEmployee],
        }))

        toast.success("Employee Added Successfully")
      },

      updateEmployee: (id, data) => {
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id
              ? { ...emp, ...data }
              : emp
          ),
        }))

        toast.success("Employee Updated Successfully")
      },

      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter(
            (emp) => emp.id !== id
          ),
        }))

        toast.success("Employee Deleted Successfully")
      },

      getEmployeeById: (id) => {
        return get().employees.find(
          (emp) => emp.id === id
        )
      },

      searchQuery: "",
      setSearchQuery: (query) =>
        set({ searchQuery: query }),

      filterDepartment: "all",
      filterStatus: "all",

      setFilterDepartment: (dept) =>
        set({ filterDepartment: dept }),

      setFilterStatus: (status) =>
        set({ filterStatus: status }),

      sortField: "firstName",
      sortOrder: "asc",

      setSort: (field, order) =>
        set({
          sortField: field,
          sortOrder: order,
        }),

      getFilteredEmployees: () => {
        const {
          employees,
          searchQuery,
          filterDepartment,
          filterStatus,
          sortField,
          sortOrder,
        } = get()

        let filtered = [...employees]

        if (searchQuery) {
          const query =
            searchQuery.toLowerCase()

          filtered = filtered.filter(
            (emp) =>
              emp.firstName
                .toLowerCase()
                .includes(query) ||
              emp.lastName
                .toLowerCase()
                .includes(query) ||
              emp.employeeId
                .toLowerCase()
                .includes(query) ||
              emp.email
                .toLowerCase()
                .includes(query)
          )
        }

        if (filterDepartment !== "all") {
          filtered = filtered.filter(
            (emp) =>
              emp.department ===
              filterDepartment
          )
        }

        if (filterStatus !== "all") {
          filtered = filtered.filter(
            (emp) =>
              emp.status === filterStatus
          )
        }

        filtered.sort((a, b) => {
          const aValue = a[sortField]
          const bValue = b[sortField]

          if (
            typeof aValue === "string" &&
            typeof bValue === "string"
          ) {
            return sortOrder === "asc"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue)
          }

          if (
            typeof aValue === "number" &&
            typeof bValue === "number"
          ) {
            return sortOrder === "asc"
              ? aValue - bValue
              : bValue - aValue
          }

          if (aValue < bValue)
            return sortOrder === "asc"
              ? -1
              : 1

          if (aValue > bValue)
            return sortOrder === "asc"
              ? 1
              : -1

          return 0
        })

        return filtered
      },

      seedData: () => {
        const sampleEmployees: Employee[] = [
          {
            id: crypto.randomUUID(),
            firstName: "Abinesh",
            lastName: "Elangovan",
            email: "abinesh@example.com",
            phone: "9876543210",
            employeeId: "EMP001",
            department: "Cyber Security",
            designation: "SOC Analyst",
            joiningDate: "2025-01-15",
            salary: 45000,
            status: "Active",
            address: "Karur, Tamil Nadu",
            attendancePercentage: 95,
            Image:
              "https://randomuser.me/api/portraits/men/1.jpg",
          },
        ]

        set({
          employees: sampleEmployees,
        })
      },
    }),
    {
      name: "employee-storage",
    }
  )
)