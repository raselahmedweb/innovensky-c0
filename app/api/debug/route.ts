import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export const runtime = "nodejs"

export async function GET() {
  try {
    // Test database connection
    const dbTest = await sql`SELECT 'Database connected' as message`

    // Check if users table exists
    const tables = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `

    // Check if admin user exists
    const adminUser = await sql`
      SELECT id, name, email, role, created_at 
      FROM users 
      WHERE email = 'admin@innovensky.com'
    `

    // Test password hashing
    const testPassword = "admin123"
    const hashedPassword = await bcrypt.hash(testPassword, 12)
    const isValid = await bcrypt.compare(testPassword, hashedPassword)

    return NextResponse.json({
      database: dbTest[0],
      tablesExist: tables.length > 0,
      adminUserExists: adminUser.length > 0,
      adminUser: adminUser[0] || null,
      passwordTest: {
        original: testPassword,
        hashed: hashedPassword,
        isValid,
      },
      environment: {
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
      },
    })
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
