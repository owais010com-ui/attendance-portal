import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
    console.log("🔥 Proxy Running:", req.nextUrl.pathname);
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};