import withAuth from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // Add any additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Return true if the user has a valid token
        return !!token
      },
    },
  },
)

// Protect these routes
export const config = {
  matcher: ["/admin/:path*"],
}
