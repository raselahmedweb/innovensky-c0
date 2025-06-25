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
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        try {
          console.log("Attempting to authenticate:", credentials.email)

          const users = await sql`
            SELECT * FROM users WHERE email = ${credentials.email}
          `

          const user = users[0]
          console.log("User found:", !!user)

          if (!user) {
            console.log("No user found with email:", credentials.email)
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          console.log("Password valid:", isPasswordValid)

          if (!isPasswordValid) {
            console.log("Invalid password for user:", credentials.email)
            return null
          }

          console.log("Authentication successful for:", credentials.email)
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
}
