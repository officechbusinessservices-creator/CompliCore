import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/pricing',
    '/demo',
    '/faq',
    '/book-demo',
    '/login',
    '/signup',
    '/reset-password',
    '/property-management-ai',
    '/lead-response-automation',
    '/leasing-follow-up-automation',
    '/admin-routing-automation',
    '/case-studies',
    '/compare',
    '/contact',
  ];

  // Check if current route is public
  const isPublicRoute = publicRoutes.some((route) => {
    if (route.includes('/compare')) {
      return pathname.startsWith('/compare');
    }
    return pathname === route;
  });

  // Allow public routes through
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options as CookieOptions);
          });
        },
      },
    });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // No session, redirect to login
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Session exists, allow access
    return response;
  }

  // Allow other routes through
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
