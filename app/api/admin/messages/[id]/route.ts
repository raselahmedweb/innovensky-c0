import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { is_read } = body
    const id = Number.parseInt(params.id)

    const result = await query("UPDATE contact_messages SET is_read = $1 WHERE id = $2 RETURNING *", [is_read, id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error updating message:", error)
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

    const result = await query("DELETE FROM contact_messages WHERE id = $1 RETURNING *", [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Message deleted successfully" })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
