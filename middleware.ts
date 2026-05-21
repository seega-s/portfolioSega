import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicAdminRoute = path === '/admin/login';
  const isAdminRoute = path.startsWith('/admin') && !isPublicAdminRoute;

  const sessionCookie = request.cookies.get('admin_session');
  
  // We can't safely compare with ADMIN_PASSWORD in edge runtime if it's not exposed, 
  // but we can check if it exists. The API will do the real verification.
  const hasSession = !!sessionCookie?.value;

  if (isAdminRoute && !hasSession) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isPublicAdminRoute && hasSession) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
