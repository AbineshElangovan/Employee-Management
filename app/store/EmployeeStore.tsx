import { create } from 'zustand'

export type Employee = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  employeeId: string
  department: string
  designation?: string
  joiningDate: string
  salary: number
  imageUrl?: string
  status: "active" | "inactive" | "on_leave"
  attendancePercentage?: number
  createdAt?: string
  updatedAt?: string
}

type EmployeeStore = {
  employees: Employee[]
  loading: boolean
  addEmployee: (employee: Employee) => void
  updateEmployee: (id: string, employee: Employee) => void
  deleteEmployee: (id: string) => void
  getEmployee: (id: string) => Employee | undefined
  fetchEmployees: () => Promise<void>
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [],
  loading: false,

  addEmployee: (employee) => {
    set((state) => ({
      employees: [employee,...state.employees]
    }))
  },

  updateEmployee: (id, updatedEmployee) => {
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === id? updatedEmployee : emp
      ),
    }))
  },

  deleteEmployee: (id) => {
    set((state) => ({
      employees: state.employees.filter((emp) => emp.id!== id),
    }))
  },

  getEmployee: (id) => {
    return get().employees.find((emp) => emp.id === id)
  },

  fetchEmployees: async () => {
    set({ loading: true })
    try {
      const res = await fetch("/api/employees")
      const data = await res.json()
      set({ employees: data, loading: false })
    } catch (error) {
      console.error("Failed to fetch employees:", error)
      set({ loading: false })
    }
  },
}))