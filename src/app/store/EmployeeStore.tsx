import { create } from 'zustand'
import { getEmployees, Employee } from '@/src/lib/db-actions'

type EmployeeStore = {
  employees: Employee[]
  loading: boolean
  error: string | null
  addEmployee: (employee: Employee) => void
  updateEmployee: (id: string, employee: Employee) => void
  deleteEmployee: (id: string) => void
  getEmployee: (id: string) => Employee | undefined
  fetchEmployees: () => Promise<void>
  generateEmployeeId: () => string
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [],
  loading: false,
  error: null,

  generateEmployeeId: () => {
    const employees = get().employees
    const numbers = employees
      .map((emp) => {    
        const match = emp.employeeId.match(/^EMP(\d+)$/i)
        return match ? parseInt(match[1], 10) : 0
      })
      .filter((n) => !isNaN(n))

    const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1
    return `EMP${String(next).padStart(3, "0")}`
  },

  addEmployee: (employee) =>
    set((state) => ({
      employees: [employee, ...state.employees],
    })),

  updateEmployee: (id, updatedEmployee) =>
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === id ? updatedEmployee : emp
      ),
    })),

  deleteEmployee: (id) =>
    set((state) => ({
      employees: state.employees.filter((emp) => emp.id !== id),
    })),

  getEmployee: (id) => {
    return get().employees.find((emp) => emp.id === id)
  },

  fetchEmployees: async () => {
    set({ loading: true, error: null })
    try {
      const data = await getEmployees()
      set({ employees: data, loading: false })
    } catch (error) {
      console.error("Failed to fetch employees:", error)
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch employees",
      })
    }
  },
}))