import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ROUTES } from './constants/routes'

const AUTH_ROUTES = [
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER,
  ROUTES.AUTH.FORGOT_PASSWORD,
  ROUTES.AUTH.VERIFY_OTP,
  ROUTES.AUTH.RESET_PASSWORD,
]

// Public routes that are always accessible — never redirected regardless of auth state
const PUBLIC_ROUTES = [
  ROUTES.HOME,
  '/explore',
]

export function proxy(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value
  const { pathname } = request.nextUrl

  // Always allow API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Always allow public routes (e.g. landing page) — no redirect ever
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  const isAuthPage = (AUTH_ROUTES as string[]).includes(pathname)
  const isDashboardPage = pathname.startsWith(ROUTES.DASHBOARD)

  // Redirect unauthenticated users to login if they try to access protected pages
  if (!token && isDashboardPage) {
    return NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, request.url))
  }

  // Redirect authenticated users to dashboard if they try to access auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
