import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;

  // Public Routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/register")
  ) {
    return NextResponse.next();
  }

  // No Token
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: string;
    };

    // Admin Routes
    if (
      pathname.startsWith("/admin") &&
      decoded.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Employee Routes
    if (
      pathname.startsWith("/employee") &&
      decoded.role !== "employee"
    ) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/employee/:path*",
  ],
}; 