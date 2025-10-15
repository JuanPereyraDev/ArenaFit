import { NextResponse } from 'next/server';

export function middleware(req) {
  const adminLogged = req.cookies.get('adminLogged');
  const { pathname } = req.nextUrl;

  if (!adminLogged && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/validar-dni/:path*'],
};
