"use client"

import type React from "react"
import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Lock, AlertCircle, CheckCircle } from "lucide-react"

export default function AdminLoginPage() {
  const searchParams = useSearchParams()
  const urlError = searchParams.get("error")
  const [credentials, setCredentials] = useState({
    email: "admin@innovensky.com",
    password: "admin123",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(urlError ?? "")
  const [success, setSuccess] = useState("")
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")
    setDebugInfo(null)

    console.log("🚀 Starting login attempt with:", {
      email: credentials.email,
      passwordLength: credentials.password.length,
    })

    try {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      })

      console.log("🔐 SignIn result:", result)

      if (result?.error) {
        console.error("❌ SignIn error:", result.error)

        // Map NextAuth error codes to user-friendly messages
        const errorMessages: Record<string, string> = {
          CredentialsSignin: "Invalid email or password",
          Configuration: "Authentication configuration error",
          AccessDenied: "Access denied",
          Verification: "Verification failed",
        }

        const userFriendlyError = errorMessages[result.error] || `Authentication failed: ${result.error}`
        setError(userFriendlyError)

        // Get debug info on error
        try {
          const debugResponse = await fetch("/api/debug")
          const debug = await debugResponse.json()
          setDebugInfo(debug)
          console.log("🔍 Debug info:", debug)
        } catch (debugError) {
          console.error("Failed to get debug info:", debugError)
        }
      } else if (result?.ok) {
        console.log("✅ SignIn successful, getting session...")
        setSuccess("Login successful! Getting session...")

        const session = await getSession()
        console.log("📋 Session:", session)

        if (session) {
          console.log("🎉 Session created successfully:", {
            userId: session.user?.id,
            userEmail: session.user?.email,
            userRole: session.user?.role,
          })
          setSuccess("Session created! Redirecting to dashboard...")

          // Small delay to show success message
          setTimeout(() => {
            router.push("/admin")
          }, 1000)
        } else {
          setError("Session creation failed - please try again")
        }
      } else {
        setError("Login failed - unknown result")
      }
    } catch (error) {
      console.error("💥 Login error:", error)
      setError("An unexpected error occurred. Check console for details.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const testDatabase = async () => {
    setError("")
    setSuccess("")
    try {
      console.log("🔍 Testing database connection...")
      const response = await fetch("/api/debug")
      const debug = await response.json()
      setDebugInfo(debug)
      console.log("🔍 Database test result:", debug)

      if (debug.database?.connected) {
        setSuccess("Database connection successful!")
      } else {
        setError("Database connection failed")
      }
    } catch (error) {
      console.error("Database test failed:", error)
      setError("Database test failed - check console for details")
    }
  }

  const testWrongPassword = () => {
    setCredentials((prev) => ({
      ...prev,
      password: "wrongpassword",
    }))
    setError("")
    setSuccess("Password changed to 'wrongpassword' - try logging in to test error handling")
  }

  const resetToCorrectPassword = () => {
    setCredentials((prev) => ({
      ...prev,
      password: "admin123",
    }))
    setError("")
    setSuccess("Password reset to 'admin123' - try logging in")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Code className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">Innovensky</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Admin Login Test</CardTitle>
          <p className="text-gray-600">Testing authentication system</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={credentials.email}
                onChange={handleChange}
                placeholder="admin@innovensky.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <p className="text-green-800 text-sm">{success}</p>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>

            {/* Test buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" size="sm" onClick={testDatabase}>
                Test DB
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={testWrongPassword}>
                Test Wrong PW
              </Button>
            </div>

            <Button type="button" variant="outline" size="sm" className="w-full" onClick={resetToCorrectPassword}>
              Reset to Correct Password
            </Button>
          </form>

          {debugInfo && (
            <div className="mt-4 p-3 bg-gray-50 border rounded-md">
              <h4 className="font-semibold text-sm mb-2">Debug Info:</h4>
              <pre className="text-xs overflow-auto max-h-40">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Test Credentials:</strong> admin@innovensky.com / admin123
            </p>
            <p className="text-xs text-gray-500">
              Current password: <code className="bg-gray-100 px-1 rounded">{credentials.password}</code>
            </p>
            <p className="text-xs text-gray-500">Check browser console for detailed logs</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
