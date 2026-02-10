import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    const { data: { session } } = await supabase.auth.getSession()

    // Protected routes
    const protectedRoutes = ['/dashboard', '/submit', '/admin'];
    const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Auth routes (redirect to dashboard if already logged in)
    const authRoutes = ['/login', '/signup'];
    const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route));

    if (isAuthRoute && session) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return res
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
