import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"

export function verifyToken(request: NextRequest): NextResponse | null {
  const authHeader = request.headers.get("Authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized: No token provided" },
      { status: 401 }
    )
  }

  const token = authHeader.split(" ")[1]
  const secret = process.env.JWT_SECRET

  if (!secret) {
    return NextResponse.json(
      { error: "Server error: JWT_SECRET not configured" },
      { status: 500 }
    )
  }

  try {
    jwt.verify(token, secret)
    return null 
  } catch (error) {
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