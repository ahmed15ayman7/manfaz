export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    // حماية كل المسارات

    "/",
    "/categories/:path*",
    "/workers/:path*",
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
    "/_next/:path*",
    "/_next/static/:path*",
    "/_next/image/:path*",
    "/favicon.ico",
    "/sitemap.xml",
    "/robots.txt",
  ]
}