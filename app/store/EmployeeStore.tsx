import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'

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
  status: 'Active' | 'Inactive' | 'On Leave'
  address: string
  attendancePercentage: number
  Image: string
}

export type EmployeeFormData = Omit<Employee, 'id' | 'Image' | 'attendancePercentage'> & {
  Image?: string
  attendancePercentage?: number
}

type SortField = 'firstName' | 'lastName' | 'joiningDate' | 'salary' | 'department' | 'employeeId' | 'status'
type SortOrder = 'asc' | 'desc'

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
          attendancePercentage: data.attendancePercentage?? Math.floor(Math.random() * 30) + 70,
          Image: data.Image || `https://api.dicebear.com/7.x/initials/svg?seed=${data.firstName}${data.lastName}`,
        }
        set((state) => ({ employees: [...state.employees, newEmployee] }))
        toast.success("Employee Added Successfully")
      },

      updateEmployee: (id, data) => {
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id? {...emp,...data } : emp
          ),
        }))
        toast.success("Employee Updated Successfully")
      },

      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id!== id),
        }))
        toast.success("Employee Deleted Successfully")
      },

      getEmployeeById: (id) => {
        return get().employees.find((emp) => emp.id === id)
      },

      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      filterDepartment: 'all',
      filterStatus: 'all',
      setFilterDepartment: (dept) => set({ filterDepartment: dept }),
      setFilterStatus: (status) => set({ filterStatus: status }),

      sortField: 'firstName',
      sortOrder: 'asc',
      setSort: (field, order) => set({ sortField: field, sortOrder: order }),

      getFilteredEmployees: () => {
        const { employees, searchQuery, filterDepartment, filterStatus, sortField, sortOrder } = get()

        let filtered = [...employees]

        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          filtered = filtered.filter(
            (emp) =>
              emp.firstName.toLowerCase().includes(query) ||
              emp.lastName.toLowerCase().includes(query) ||
              emp.employeeId.toLowerCase().includes(query) ||
              emp.email.toLowerCase().includes(query)
          )
        }

        if (filterDepartment!== 'all') {
          filtered = filtered.filter((emp) => emp.department === filterDepartment)
        }

        if (filterStatus!== 'all') {
          filtered = filtered.filter((emp) => emp.status === filterStatus)
        }

        filtered.sort((a, b) => {
          const aValue = a[sortField]
          const bValue = b[sortField]

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === "asc"
             ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue)
          }

          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder === "asc"? aValue - bValue : bValue - aValue
          }

          if (aValue < bValue) return sortOrder === "asc"? -1 : 1
          if (aValue > bValue) return sortOrder === "asc"? 1 : -1
          return 0
        })

        return filtered
      },

      seedData: () => {
        const dummyEmployees: Employee[] = [
          { id: '1', firstName: 'Aarav', lastName: 'Sharma', email: 'aarav.sharma@company.com', phone: '9876543210', employeeId: 'EMP001', department: 'Development', designation: 'Tech Lead', joiningDate: '2020-03-15', salary: 165000, status: 'Active', address: 'Koramangala, Bangalore, KA', attendancePercentage: 96, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=AaravSharma' },
          { id: '2', firstName: 'Diya', lastName: 'Patel', email: 'diya.patel@company.com', phone: '9876543211', employeeId: 'EMP002', department: 'Design', designation: 'UI/UX Lead', joiningDate: '2020-08-22', salary: 125000, status: 'Active', address: 'Andheri West, Mumbai, MH', attendancePercentage: 94, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=DiyaPatel' },
          { id: '3', firstName: 'Vivaan', lastName: 'Kumar', email: 'vivaan.kumar@company.com', phone: '9876543212', employeeId: 'EMP003', department: 'Sales', designation: 'Sales Manager', joiningDate: '2021-01-10', salary: 95000, status: 'Active', address: 'Gachibowli, Hyderabad, TS', attendancePercentage: 91, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=VivaanKumar' },
          { id: '4', firstName: 'Ananya', lastName: 'Reddy', email: 'ananya.reddy@company.com', phone: '9876543213', employeeId: 'EMP004', department: 'HR', designation: 'HR Business Partner', joiningDate: '2021-11-05', salary: 88000, status: 'Active', address: 'Banjara Hills, Hyderabad, TS', attendancePercentage: 93, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=AnanyaReddy' },
          { id: '5', firstName: 'Aditya', lastName: 'Singh', email: 'aditya.singh@company.com', phone: '9876543214', employeeId: 'EMP005', department: 'Finance', designation: 'Senior Accountant', joiningDate: '2020-05-18', salary: 82000, status: 'Active', address: 'Salt Lake, Kolkata, WB', attendancePercentage: 95, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=AdityaSingh' },
          { id: '6', firstName: 'Ishaan', lastName: 'Gupta', email: 'ishaan.gupta@company.com', phone: '9876543215', employeeId: 'EMP006', department: 'Marketing', designation: 'Digital Marketing Manager', joiningDate: '2022-07-12', salary: 92000, status: 'Active', address: 'Connaught Place, New Delhi, DL', attendancePercentage: 89, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=IshaanGupta' },
          { id: '7', firstName: 'Kavya', lastName: 'Nair', email: 'kavya.nair@company.com', phone: '9876543216', employeeId: 'EMP007', department: 'Development', designation: 'Frontend Developer', joiningDate: '2023-02-28', salary: 78000, status: 'Active', address: 'Kochi, KL', attendancePercentage: 92, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=KavyaNair' },
          { id: '8', firstName: 'Arjun', lastName: 'Mehta', email: 'arjun.mehta@company.com', phone: '9876543217', employeeId: 'EMP008', department: 'Sales', designation: 'Business Development Executive', joiningDate: '2022-09-15', salary: 65000, status: 'Active', address: 'Ahmedabad, GJ', attendancePercentage: 87, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=ArjunMehta' },
          { id: '9', firstName: 'Saanvi', lastName: 'Joshi', email: 'saanvi.joshi@company.com', phone: '9876543218', employeeId: 'EMP009', department: 'Design', designation: 'Product Designer', joiningDate: '2021-12-01', salary: 105000, status: 'On Leave', address: 'Pune, MH', attendancePercentage: 85, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=SaanviJoshi' },
          { id: '10', firstName: 'Reyansh', lastName: 'Verma', email: 'reyansh.verma@company.com', phone: '9876543219', employeeId: 'EMP010', department: 'Development', designation: 'DevOps Engineer', joiningDate: '2022-04-20', salary: 115000, status: 'Active', address: 'Noida, UP', attendancePercentage: 94, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=ReyanshVerma' },
          { id: '11', firstName: 'Myra', lastName: 'Malhotra', email: 'myra.malhotra@company.com', phone: '9876543220', employeeId: 'EMP011', department: 'HR', designation: 'Talent Acquisition Specialist', joiningDate: '2023-01-05', salary: 68000, status: 'Active', address: 'Gurgaon, HR', attendancePercentage: 90, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=MyraMalhotra' },
          { id: '12', firstName: 'Ayaan', lastName: 'Khan', email: 'ayaan.khan@company.com', phone: '9876543221', employeeId: 'EMP012', department: 'Finance', designation: 'Financial Analyst', joiningDate: '2022-06-14', salary: 75000, status: 'Active', address: 'Lucknow, UP', attendancePercentage: 92, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=AyaanKhan' },
          { id: '13', firstName: 'Pari', lastName: 'Choudhary', email: 'pari.choudhary@company.com', phone: '9876543222', employeeId: 'EMP013', department: 'Marketing', designation: 'Content Strategist', joiningDate: '2023-03-22', salary: 72000, status: 'Active', address: 'Jaipur, RJ', attendancePercentage: 88, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=PariChoudhary' },
          { id: '14', firstName: 'Vihaan', lastName: 'Agarwal', email: 'vihaan.agarwal@company.com', phone: '9876543223', employeeId: 'EMP014', department: 'Development', designation: 'Backend Developer', joiningDate: '2021-09-08', salary: 98000, status: 'Active', address: 'Indore, MP', attendancePercentage: 93, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=VihaanAgarwal' },
          { id: '15', firstName: 'Anaya', lastName: 'Bansal', email: 'anaya.bansal@company.com', phone: '9876543224', employeeId: 'EMP015', department: 'Design', designation: 'Graphic Designer', joiningDate: '2023-05-10', salary: 58000, status: 'Active', address: 'Chandigarh, CH', attendancePercentage: 91, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=AnayaBansal' },
          { id: '16', firstName: 'Kabir', lastName: 'Rastogi', email: 'kabir.rastogi@company.com', phone: '9876543225', employeeId: 'EMP016', department: 'Sales', designation: 'Regional Sales Head', joiningDate: '2020-02-14', salary: 135000, status: 'Active', address: 'Surat, GJ', attendancePercentage: 95, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=KabirRastogi' },
          { id: '17', firstName: 'Ira', lastName: 'Saxena', email: 'ira.saxena@company.com', phone: '9876543226', employeeId: 'EMP017', department: 'HR', designation: 'HR Manager', joiningDate: '2021-06-30', salary: 110000, status: 'Active', address: 'Bhopal, MP', attendancePercentage: 94, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=IraSaxena' },
          { id: '18', firstName: 'Atharv', lastName: 'Tiwari', email: 'atharv.tiwari@company.com', phone: '9876543227', employeeId: 'EMP018', department: 'Finance', designation: 'Accounts Manager', joiningDate: '2021-04-12', salary: 95000, status: 'Active', address: 'Nagpur, MH', attendancePercentage: 92, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=AtharvTiwari' },
          { id: '19', firstName: 'Navya', lastName: 'Mishra', email: 'navya.mishra@company.com', phone: '9876543228', employeeId: 'EMP019', department: 'Marketing', designation: 'Brand Manager', joiningDate: '2022-11-18', salary: 102000, status: 'Active', address: 'Patna, BR', attendancePercentage: 90, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=NavyaMishra' },
          { id: '20', firstName: 'Rudra', lastName: 'Yadav', email: 'rudra.yadav@company.com', phone: '9876543229', employeeId: 'EMP020', department: 'Development', designation: 'QA Engineer', joiningDate: '2023-04-05', salary: 70000, status: 'Active', address: 'Varanasi, UP', attendancePercentage: 88, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=RudraYadav' },
          { id: '21', firstName: 'Kiara', lastName: 'Kapoor', email: 'kiara.kapoor@company.com', phone: '9876543230', employeeId: 'EMP021', department: 'Design', designation: 'Motion Designer', joiningDate: '2022-08-25', salary: 85000, status: 'Active', address: 'Thane, MH', attendancePercentage: 93, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=KiaraKapoor' },
          { id: '22', firstName: 'Shivansh', lastName: 'Chopra', email: 'shivansh.chopra@company.com', phone: '9876543231', employeeId: 'EMP022', department: 'Sales', designation: 'Inside Sales Rep', joiningDate: '2023-06-15', salary: 60000, status: 'On Leave', address: 'Faridabad, HR', attendancePercentage: 82, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=ShivanshChopra' },
          { id: '23', firstName: 'Avni', lastName: 'Bhatia', email: 'avni.bhatia@company.com', phone: '9876543232', employeeId: 'EMP023', department: 'HR', designation: 'HR Executive', joiningDate: '2022-12-08', salary: 55000, status: 'Active', address: 'Amritsar, PB', attendancePercentage: 91, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=AvniBhatia' },
          { id: '24', firstName: 'Yuvraj', lastName: 'Sethi', email: 'yuvraj.sethi@company.com', phone: '9876543233', employeeId: 'EMP024', department: 'Finance', designation: 'Tax Consultant', joiningDate: '2021-07-20', salary: 90000, status: 'Active', address: 'Ludhiana, PB', attendancePercentage: 94, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=YuvrajSethi' },
          { id: '25', firstName: 'Aadhya', lastName: 'Goyal', email: 'aadhya.goyal@company.com', phone: '9876543234', employeeId: 'EMP025', department: 'Marketing', designation: 'SEO Specialist', joiningDate: '2023-01-30', salary: 62000, status: 'Active', address: 'Ghaziabad, UP', attendancePercentage: 89, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=AadhyaGoyal' },
          { id: '26', firstName: 'Krishna', lastName: 'Menon', email: 'krishna.menon@company.com', phone: '9876543235', employeeId: 'EMP026', department: 'Development', designation: 'Tech Lead', joiningDate: '2019-10-10', salary: 175000, status: 'Active', address: 'Trivandrum, KL', attendancePercentage: 97, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=KrishnaMenon' },
          { id: '27', firstName: 'Riya', lastName: 'Desai', email: 'riya.desai@company.com', phone: '9876543236', employeeId: 'EMP027', department: 'Design', designation: 'Junior Designer', joiningDate: '2024-01-12', salary: 48000, status: 'Active', address: 'Vadodara, GJ', attendancePercentage: 86, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=RiyaDesai' },
          { id: '28', firstName: 'Dhruv', lastName: 'Shah', email: 'dhruv.shah@company.com', phone: '9876543237', employeeId: 'EMP028', department: 'Sales', designation: 'Field Sales Executive', joiningDate: '2023-08-14', salary: 52000, status: 'Active', address: 'Rajkot, GJ', attendancePercentage: 84, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=DhruvShah' },
          { id: '29', firstName: 'Tara', lastName: 'Iyer', email: 'tara.iyer@company.com', phone: '9876543238', employeeId: 'EMP029', department: 'HR', designation: 'Payroll Specialist', joiningDate: '2022-03-03', salary: 63000, status: 'On Leave', address: 'Coimbatore, TN', attendancePercentage: 80, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=TaraIyer' },
          { id: '30', firstName: 'Karan', lastName: 'Pillai', email: 'karan.pillai@company.com', phone: '9876543239', employeeId: 'EMP030', department: 'Finance', designation: 'Audit Manager', joiningDate: '2020-09-25', salary: 118000, status: 'Active', address: 'Madurai, TN', attendancePercentage: 95, Image: 'https://api.dicebear.com/7.x/initials/svg?seed=KaranPillai' }
        ]
        set({ employees: dummyEmployees })
      },
    }),
    {
      name: "employee-storage",
    }
  )
)