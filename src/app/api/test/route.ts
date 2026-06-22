// import { NextResponse } from "next/server"
// import db from "@/lib/db"

// export async function GET() {
//   try {
//     const employees = db.prepare("SELECT * FROM employees").all()

//     return NextResponse.json({
//       count: employees.length,
//       data: employees,
//     })
//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         error: error.message || "Failed to fetch employees test data",
//       },
//       { status: 500 }
//     )
//   }
// }