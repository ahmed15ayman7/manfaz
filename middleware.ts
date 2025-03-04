export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    // حماية كل المسارات
    "/((?!api|_next/static|_next/image|favicon.ico|auth).*)",
  ]
}