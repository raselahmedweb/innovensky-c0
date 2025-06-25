import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { sql } from "./db"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔐 Starting authentication process...")

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing email or password")
          return null
        }

        console.log("📧 Attempting to authenticate:", credentials.email)

        try {
          // Test database connection first
          console.log("🔍 Testing database connection...")
          const dbTest = await sql`SELECT 1 as test`
          console.log("✅ Database connection successful")

          // Find user
          console.log("👤 Looking for user in database...")
          const users = await sql`
            SELECT id, name, email, password, role, created_at 
            FROM users 
            WHERE email = ${credentials.email}
          `

          console.log("📊 Query result:", {
            userCount: users.length,
            userFound: users.length > 0,
          })

          const user = users[0]

          if (!user) {
            console.log("❌ No user found with email:", credentials.email)

            // List all users for debugging
            const allUsers = await sql`SELECT email FROM users`
            console.log(
              "📋 Available users:",
              allUsers.map((u) => u.email),
            )

            return null
          }

          console.log("✅ User found:", {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            hasPassword: !!user.password,
          })

          // Verify password
          console.log("🔑 Verifying password...")
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          console.log("🔑 Password verification result:", isPasswordValid)

          if (!isPasswordValid) {
            console.log("❌ Invalid password for user:", credentials.email)

            // Debug: show password hash info
            console.log("🔍 Password debug:", {
              providedPassword: credentials.password,
              storedHashLength: user.password?.length,
              hashStartsWith: user.password?.substring(0, 10),
            })

            return null
          }

          console.log("🎉 Authentication successful for:", credentials.email)

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("💥 Auth error:", error)
          console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace")
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login", // custom sign-in
    error: "/admin/login", // send all auth errors here
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("🎫 JWT callback:", { hasUser: !!user, tokenSub: token.sub })
      if (user) {
        token.role = user.role
        console.log("🎫 Added role to token:", user.role)
      }
      return token
    },
    async session({ session, token }) {
      // token is empty when the visitor is NOT signed-in
      if (token && token.sub) {
        // Make sure session.user exists before mutating
        session.user = {
          ...(session.user || {}),
          id: token.sub,
          role: token.role as string | undefined,
        }
      }
      return session
    },
  },
  debug: true, // Always enable debug for now
  logger: {
    error(code, metadata) {
      console.error("NextAuth Error:", code, metadata)
    },
    warn(code) {
      console.warn("NextAuth Warning:", code)
    },
    debug(code, metadata) {
      console.log("NextAuth Debug:", code, metadata)
    },
  },
}
