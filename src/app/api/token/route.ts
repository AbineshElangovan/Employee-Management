import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const secret = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || "default_jwt_secret"

    const token = jwt.sign(
      { app: "employee-management" },
      secret,
      { expiresIn: "1m" }
    )
    console.log("token expiry")
    console.log("New Token", token)
    return NextResponse.json({ token })
  } catch (error) {
    console.error("Token generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    )
  }
}