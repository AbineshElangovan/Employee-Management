import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const departments = [
  "Development",
  "Sales",
  "HR",
  "Marketing",
  "Finance",
  "Design",
  "IT",
  "Cyber Security",
]

const designationsByDepartment: Record<string, string[]> = {
  Development: ["Senior Software Engineer", "Full Stack Developer", "Backend Developer", "Frontend Architect", "DevOps Engineer"],
  Sales: ["Sales Director", "Account Executive", "Business Development Manager", "Sales Representative"],
  HR: ["HR Manager", "Talent Acquisition Specialist", "HR Generalist", "People Operations Lead"],
  Marketing: ["Marketing Manager", "Content Strategist", "SEO Specialist", "Growth Marketer"],
  Finance: ["Financial Analyst", "Senior Accountant", "Finance Manager", "Payroll Specialist"],
  Design: ["Lead UI/UX Designer", "Product Designer", "Brand Designer", "Visual Designer"],
  IT: ["IT Support Specialist", "System Administrator", "Network Engineer", "IT Infrastructure Lead"],
  "Cyber Security": ["Security Analyst", "Penetration Tester", "Cyber Security Engineer", "Information Security Officer"],
}


const statuses = [
  "Active", "Active", "Active", "Active", "Active",
  "Inactive", "On Leave", "Active", "Active", "Inactive"
]

const samplePeople = [
  { firstName: "Abinesh", lastName: "Elangovan" },
  { firstName: "Alexander", lastName: "Wright" },
  { firstName: "Sophia", lastName: "Chen" },
  { firstName: "Marcus", lastName: "Johnson" },
  { firstName: "Emily", lastName: "Davis" },
  { firstName: "David", lastName: "Kim" },
  { firstName: "Olivia", lastName: "Martinez" },
  { firstName: "James", lastName: "Wilson" },
  { firstName: "Ava", lastName: "Taylor" },
  { firstName: "Benjamin", lastName: "Anderson" },
  { firstName: "Isabella", lastName: "Thomas" },
  { firstName: "Lucas", lastName: "Jackson" },
  { firstName: "Mia", lastName: "White" },
  { firstName: "Ethan", lastName: "Harris" },
  { firstName: "Charlotte", lastName: "Martin" },
  { firstName: "Henry", lastName: "Thompson" },
  { firstName: "Amelia", lastName: "Garcia" },
  { firstName: "Sebastian", lastName: "Martinez" },
  { firstName: "Harper", lastName: "Robinson" },
  { firstName: "Jack", lastName: "Clark" },
  { firstName: "Evelyn", lastName: "Rodriguez" },
  { firstName: "Owen", lastName: "Lewis" },
  { firstName: "Abigail", lastName: "Lee" },
  { firstName: "Daniel", lastName: "Walker" },
  { firstName: "Emily", lastName: "Hall" },
  { firstName: "Matthew", lastName: "Allen" },
  { firstName: "Ella", lastName: "Young" },
  { firstName: "Jackson", lastName: "Hernandez" },
  { firstName: "Scarlett", lastName: "King" },
  { firstName: "Levi", lastName: "Wright" },
  { firstName: "Grace", lastName: "Lopez" },
  { firstName: "Oliver", lastName: "Hill" },
  { firstName: "Chloe", lastName: "Scott" },
  { firstName: "Samuel", lastName: "Green" },
  { firstName: "Victoria", lastName: "Adams" },
  { firstName: "Gabriel", lastName: "Baker" },
  { firstName: "Hannah", lastName: "Gonzalez" },
  { firstName: "Carter", lastName: "Nelson" },
  { firstName: "Nora", lastName: "Carter" },
  { firstName: "Wyatt", lastName: "Mitchell" },
  { firstName: "Lily", lastName: "Perez" },
  { firstName: "Dylan", lastName: "Roberts" },
  { firstName: "Zoe", lastName: "Turner" },
  { firstName: "Nathan", lastName: "Phillips" },
  { firstName: "Penelope", lastName: "Campbell" },
  { firstName: "Caleb", lastName: "Parker" },
]

const cities = ["New York", "San Francisco", "Austin", "Seattle", "Chicago", "Boston", "Los Angeles", "Denver"]

async function main() {
  console.log("Cleaning old data...")
  await prisma.attendance.deleteMany()
  await prisma.employee.deleteMany()

  console.log("Seeding 45 comprehensive employee records...")

  const createdEmployees = []

  
  const attendancePercentages = [
    95, 98, 92, 96, 91, 94, 88, 85, 82, 79, 76, 74, 68, 62, 55, 48, 42, 97, 93, 89,
    84, 96, 91, 78, 83, 95, 90, 72, 65, 45, 99, 93, 87, 81, 77, 94, 86, 73, 58, 40,
    96, 90, 84, 75, 60
  ]

  for (let i = 0; i < samplePeople.length; i++) {
    const person = samplePeople[i]
    const empIdNum = (i + 1).toString().padStart(3, "0")
    const employeeId = `EMP-${empIdNum}`
    const department = departments[i % departments.length]
    const designations = designationsByDepartment[department]
    let designation = designations[i % designations.length]
    let status = statuses[i % statuses.length]
    let salary = 50000 + (i * 2250) % 95000
    let attendancePercentage = attendancePercentages[i % attendancePercentages.length]

    if (i === 0) {
      designation = "Head of Development"
      status = "Active"
      salary = 250000
      attendancePercentage = 99
    }

    const year = 2021 + (i % 4)
    const month = (i % 12)
    const day = (i * 5 % 26) + 1
    const joiningDate = new Date(year, month, day)

    const city = cities[i % cities.length]
    const phone = `+1 (555) ${100 + ((i * 37) % 899)}-${1000 + ((i * 123) % 8999)}`
    const email = `${person.firstName.toLowerCase()}.${person.lastName.toLowerCase()}${i + 1}@company.com`
    const avatarIndex = (i % 70) + 1
    const imageUrl = `https://i.pravatar.cc/150?img=${avatarIndex}`

    const isFavorite = i < departments.length

    const emp = await prisma.employee.create({
      data: {
        employeeId,
        firstName: person.firstName,
        lastName: person.lastName,
        email,
        phone,
        department,
        position: designation,
        designation,
        salary,
        status,
        attendancePercentage,
        address: `${100 + i * 15} Main Street, Suite ${i + 1}, ${city}`,
        joiningDate,
        imageUrl,
        isFavorite,
      },
    })

    createdEmployees.push(emp)
  }

  console.log(`Created ${createdEmployees.length} employees. Seeding attendance records...`)

  
  const today = new Date()
  const attendanceRecords = []

  for (const emp of createdEmployees) {
    
    const daysToCreate = emp.status === "Inactive" ? 5 : 15

    for (let d = 1; d <= daysToCreate; d++) {
      const date = new Date(today)
      date.setDate(today.getDate() - d)

      
      if (date.getDay() === 0 || date.getDay() === 6) continue

      let attStatus = "Present"
      if (emp.status === "On Leave") {
        attStatus = d <= 5 ? "On Leave" : "Present"
      } else if (emp.status === "Inactive") {
        attStatus = "Absent"
      } else {
        const rand = (d + emp.employeeId.charCodeAt(4)) % 10
        if (rand === 0) attStatus = "Absent"
        else if (rand === 1) attStatus = "Half Day"
      }

      let checkIn: Date | null = new Date(date)
      let checkOut: Date | null = new Date(date)

      if (attStatus === "Present") {
        checkIn.setHours(9, Math.floor(Math.random() * 30), 0)
        checkOut.setHours(17, 30 + Math.floor(Math.random() * 30), 0)
      } else if (attStatus === "Half Day") {
        checkIn.setHours(9, 0, 0)
        checkOut.setHours(13, 0, 0)
      } else {
        checkIn = null
        checkOut = null
      }

      attendanceRecords.push({
        employeeId: emp.id,
        date: new Date(date.toISOString().split("T")[0]),
        status: attStatus,
        checkIn,
        checkOut,
      })
    }
  }

  for (const att of attendanceRecords) {
    await prisma.attendance.create({ data: att }).catch(() => {})
  }

  console.log(`Successfully seeded ${createdEmployees.length} employees and ${attendanceRecords.length} attendance logs!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
