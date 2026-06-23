import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"

export function verifyToken(request: NextRequest): NextResponse | null {

  console.log("verifyToken called")
  console.log("Request URL:", request.nextUrl.pathname)
  console.log("Method:", request.method)

  const authHeader = request.headers.get("Authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No Authorization token")

    return NextResponse.json(
      { error: "Unauthorized: No token provided" },
      { status: 401 }
    )
  }

  const token = authHeader.split(" ")[1]

  console.log("TOKEN RECEIVED:", token)

  const secret = process.env.JWT_SECRET

  if (!secret) {
    console.log("JWT_SECRET missing")

    return NextResponse.json(
      { error: "Server error: JWT_SECRET not configured" },
      { status: 500 }
    )
  }

  try {
    jwt.verify(token, secret)

    console.log("TOKEN VERIFIED SUCCESS")

    return null

  } catch (error) {

    console.log("TOKEN VERIFY FAILED")

    if (error instanceof Error && error.name === "TokenExpiredError") {
      return NextResponse.json(
        { error: "Unauthorized: Token expired" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Unauthorized: Invalid token" },
      { status: 401 }
    )
  }
}