"use server"
export async function getEmployees() {
  const res = await fetch(`${process.env.BACKEND_URL}/employees`, {
    cache: 'no-store'
  })
  if (!res.ok) throw new Error("Failed to fetch")
  return res.json()
}