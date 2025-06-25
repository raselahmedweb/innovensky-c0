import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await query("SELECT * FROM team_members ORDER BY created_at DESC")

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching team members:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, role, bio, image_url, linkedin_url, github_url, twitter_url } = body

    if (!name || !role || !bio) {
      return NextResponse.json({ error: "Name, role, and bio are required" }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO team_members (name, role, bio, image_url, linkedin_url, github_url, twitter_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, role, bio, image_url || null, linkedin_url || null, github_url || null, twitter_url || null],
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating team member:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
