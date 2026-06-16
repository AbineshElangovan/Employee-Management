import { create } from 'zustand'
import { getEmployees, Employee } from '@/lib/db-actions'

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
      const data = await getEmployees()
      set({ employees: data, loading: false })
    } catch (error) {
      console.error("Failed to fetch employees:", error)
      set({ loading: false })
    }
  },
}))