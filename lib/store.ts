import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Employee } from './types'

interface EmployeeState {
  employees: Employee[]
  favorites: string[]
  addEmployee: (employee: Omit<Employee, 'id'>) => void
  updateEmployee: (id: string, data: Partial<Employee>) => void
  deleteEmployee: (id: string) => void
  toggleFavorite: (id: string) => void
  getEmployeeById: (id: string) => Employee | undefined
}

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set, get) => ({
      employees: [],
      favorites: [],

      addEmployee: (employee) => {
        const newEmployee: Employee = {
         ...employee,
          id: crypto.randomUUID()
        }
        set((state) => ({ employees: [...state.employees, newEmployee] }))
      },

      updateEmployee: (id, data) => {
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id? {...emp,...data } : emp
          )
        }))
      },

      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id!== id),
          favorites: state.favorites.filter((favId) => favId!== id)
        }))
      },

      toggleFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.includes(id)
           ? state.favorites.filter((favId) => favId!== id)
            : [...state.favorites, id]
        }))
      },

      getEmployeeById: (id) => get().employees.find((emp) => emp.id === id)
    }),
    {
      name: 'employee-storage'
    }
  )
)