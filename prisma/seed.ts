import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const departments = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Operations",
  "Customer Support",
]

const employees = [
  { firstName: "Aarav", lastName: "Sharma", department: "Engineering", designation: "Senior Software Engineer", status: "active", salary: 95000, attendancePercentage: 96, joiningDate: "2021-03-15" },
  { firstName: "Priya", lastName: "Nair", department: "Design", designation: "Lead Product Designer", status: "active", salary: 88000, attendancePercentage: 98, joiningDate: "2020-07-01" },
  { firstName: "Rohan", lastName: "Mehta", department: "Engineering", designation: "Backend Engineer", status: "active", salary: 82000, attendancePercentage: 92, joiningDate: "2022-01-10" },
  { firstName: "Sneha", lastName: "Iyer", department: "Product", designation: "Product Manager", status: "active", salary: 99000, attendancePercentage: 95, joiningDate: "2019-11-20" },
  { firstName: "Vikram", lastName: "Reddy", department: "Sales", designation: "Sales Executive", status: "on_leave", salary: 60000, attendancePercentage: 78, joiningDate: "2023-02-05" },
  { firstName: "Ananya", lastName: "Das", department: "Marketing", designation: "Marketing Specialist", status: "active", salary: 65000, attendancePercentage: 90, joiningDate: "2022-06-12" },
  { firstName: "Karthik", lastName: "Pillai", department: "Engineering", designation: "DevOps Engineer", status: "active", salary: 91000, attendancePercentage: 97, joiningDate: "2021-09-08" },
  { firstName: "Divya", lastName: "Menon", department: "Human Resources", designation: "HR Manager", status: "active", salary: 78000, attendancePercentage: 99, joiningDate: "2018-04-22" },
  { firstName: "Arjun", lastName: "Kapoor", department: "Finance", designation: "Financial Analyst", status: "active", salary: 72000, attendancePercentage: 93, joiningDate: "2020-12-01" },
  { firstName: "Meera", lastName: "Joshi", department: "Operations", designation: "Operations Coordinator", status: "inactive", salary: 58000, attendancePercentage: 40, joiningDate: "2022-08-17" },
  { firstName: "Siddharth", lastName: "Rao", department: "Engineering", designation: "Frontend Engineer", status: "active", salary: 84000, attendancePercentage: 94, joiningDate: "2023-05-03" },
  { firstName: "Kavya", lastName: "Krishnan", department: "Customer Support", designation: "Support Lead", status: "active", salary: 56000, attendancePercentage: 96, joiningDate: "2021-01-25" },
  { firstName: "Aditya", lastName: "Bose", department: "Product", designation: "Associate Product Manager", status: "active", salary: 74000, attendancePercentage: 91, joiningDate: "2022-10-14" },
  { firstName: "Ritu", lastName: "Chawla", department: "Design", designation: "UX Researcher", status: "active", salary: 79000, attendancePercentage: 89, joiningDate: "2021-06-30" },
  { firstName: "Nikhil", lastName: "Verma", department: "Sales", designation: "Account Executive", status: "active", salary: 67000, attendancePercentage: 88, joiningDate: "2023-03-19" },
  { firstName: "Pooja", lastName: "Agarwal", department: "Marketing", designation: "Content Strategist", status: "on_leave", salary: 63000, attendancePercentage: 75, joiningDate: "2022-02-28" },
  { firstName: "Manish", lastName: "Tiwari", department: "Engineering", designation: "QA Engineer", status: "active", salary: 76000, attendancePercentage: 95, joiningDate: "2020-09-11" },
  { firstName: "Shreya", lastName: "Bhatt", department: "Finance", designation: "Accounts Payable Specialist", status: "active", salary: 54000, attendancePercentage: 97, joiningDate: "2019-05-06" },
  { firstName: "Varun", lastName: "Malhotra", department: "Operations", designation: "Logistics Manager", status: "active", salary: 71000, attendancePercentage: 92, joiningDate: "2021-11-02" },
  { firstName: "Ishita", lastName: "Sen", department: "Human Resources", designation: "Talent Acquisition Specialist", status: "inactive", salary: 60000, attendancePercentage: 35, joiningDate: "2022-04-09" },
]

function randomPhone() {
  const n = () => Math.floor(1000 + Math.random() * 9000)
  return `+91 ${n()}${n()}${n()}`.slice(0, 14)
}

function slug(first: string, last: string) {
  return `${first}.${last}`.toLowerCase().replace(/[^a-z.]/g, "")
}

async function main() {
  console.log("Seeding employees...")

  for (let i = 0; i < employees.length; i++) {
    const e = employees[i]
    const employeeId = `EMP${String(1001 + i).padStart(4, "0")}`
    const email = `${slug(e.firstName, e.lastName)}@company.com`

    await prisma.employee.upsert({
      where: { employeeId },
      update: {},
      create: {
        employeeId,
        firstName: e.firstName,
        lastName: e.lastName,
        email,
        phone: randomPhone(),
        department: e.department,
        designation: e.designation,
        salary: e.salary,
        Status: e.status,
        attendancePercentage: e.attendancePercentage,
        address: `${100 + i} ${e.department} Street, Bengaluru, KA`,
        joiningDate: new Date(e.joiningDate),
        imageUrl: "",
      },
    })
  }

  console.log(`Seeded ${employees.length} employees.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })