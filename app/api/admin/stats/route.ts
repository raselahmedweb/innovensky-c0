import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [projectsResult, teamResult, messagesResult, unreadResult] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM projects`,
      sql`SELECT COUNT(*) as count FROM team_members`,
      sql`SELECT COUNT(*) as count FROM contact_messages`,
      sql`SELECT COUNT(*) as count FROM contact_messages WHERE read = false`,
    ])

    const stats = {
      projects: Number.parseInt(projectsResult[0].count),
      teamMembers: Number.parseInt(teamResult[0].count),
      messages: Number.parseInt(messagesResult[0].count),
      unreadMessages: Number.parseInt(unreadResult[0].count),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
