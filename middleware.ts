import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from './lib/session'
import { login, logout } from './lib/auth'

const protectedRoutes = ['/platform']
 
export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const code = req.nextUrl.searchParams.get('code')
  const logOut = req.nextUrl.searchParams.get('logout')

  if (logOut === 'true') {
    return await logout(req)
  }

  if (isProtectedRoute && !code) {
    return await verifySession(req)
  } else if (isProtectedRoute && code) {
    return await login(req, code);
  }
 
  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}