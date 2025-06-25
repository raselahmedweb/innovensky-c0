import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Run this route in the Node.js runtime (Edge lacks Node-native APIs used by bcryptjs)
export const runtime = "nodejs"
// Ensure the route is always dynamic (no caching)
export const dynamic = "force-dynamic"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
