import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const secret = process.env.JWT_SECRET

    if (!secret) {
      return NextResponse.json(
        { error: "JWT_SECRET is not defined" },
        { status: 500 }
      )
    }

    const token = jwt.sign(
      { app: "employee-management" },
      secret,
      { expiresIn: "10m" }
    )

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Token generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    )
  }
}