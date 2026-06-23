// import jwt from "jsonwebtoken"

// const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!
// const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!
// const ACCESS_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m"
// const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d"

// export type JwtPayload = {
//   userId: string
//   email: string
//   role: string
// }

// export function signAccessToken(payload: JwtPayload) {
//   return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN })
// }

// export function signRefreshToken(payload: JwtPayload) {
//   return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN })
// }

// export function verifyAccessToken(token: string): JwtPayload {
//   return jwt.verify(token, ACCESS_SECRET) as JwtPayload
// }

// export function verifyRefreshToken(token: string): JwtPayload {
//   return jwt.verify(token, REFRESH_SECRET) as JwtPayload
// }