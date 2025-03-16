import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default withAuth(
  function middleware(request: NextRequest) {
    let locale = request.cookies.get('locale')
    if (!locale) {
      // If no locale cookie exists, set default to 'en'
      const response = NextResponse.next()
      response.cookies.set('locale', 'en')
      return response
    }
    
    // Update html lang and dir attributes
    const response = NextResponse.next()
    response.headers.set('x-locale', locale.value)
    return response
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    // حماية المسارات المطلوبة فقط
    "/categories/:path*",
    "/worker/:path*",
    "/stores/:path*",
    "/products/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/services/:path*",
    "/user-location/:path*",
    "/api/:path*",
  ]
}