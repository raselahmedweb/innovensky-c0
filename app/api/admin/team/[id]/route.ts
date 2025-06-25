import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, role, bio, image_url, linkedin_url, github_url, twitter_url } = body
    const id = Number.parseInt(params.id)

    if (!name || !role || !bio) {
      return NextResponse.json({ error: "Name, role, and bio are required" }, { status: 400 })
    }

    const result = await query(
      `UPDATE team_members 
       SET name = $1, role = $2, bio = $3, image_url = $4, 
           linkedin_url = $5, github_url = $6, twitter_url = $7
       WHERE id = $8
       RETURNING *`,
      [name, role, bio, image_url || null, linkedin_url || null, github_url || null, twitter_url || null, id],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error updating team member:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)

    const result = await query("DELETE FROM team_members WHERE id = $1 RETURNING *", [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Team member deleted successfully" })
  } catch (error) {
    console.error("Error deleting team member:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
