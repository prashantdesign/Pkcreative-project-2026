import { NextResponse } from "next/server";

export function proxy(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  const path = url.pathname;

  // 1. Skip proxy for next.js internal assets, static files, and api routes
  if (
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    path.includes(".") ||
    path.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // 2. Identify the subdomain
  let subdomain = "";

  // Localhost checks (e.g. greenshop.localhost:3000 or greenshop.127.0.0.1:3000)
  if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    const hostPart = hostname.split(":")[0];
    if (hostPart !== "localhost" && hostPart !== "127.0.0.1") {
      // Remove trailing domain info to isolate subdomain
      subdomain = hostPart.replace(".localhost", "").replace(".127.0.0.1", "");
    }
  } else {
    // Production checks (we split by '.' and check if it's a subdomain)
    // E.g. greenshop.pkcreative.in or greenshop.pkcreative-project2026.vercel.app
    const parts = hostname.split(".");
    const isVercelDomain = hostname.endsWith("vercel.app");

    if (isVercelDomain) {
      // For Vercel domains, e.g. client.project-name.vercel.app has 4 parts
      if (parts.length > 3) {
        subdomain = parts[0];
      }
    } else {
      // For custom domains, e.g. client.yourdomain.com has 3 parts
      if (parts.length > 2) {
        subdomain = parts[0];
      }
    }
  }

  // 3. If a valid client subdomain is found, rewrite the path internally to /sites/[subdomain]
  if (subdomain && subdomain !== "www" && subdomain !== "admin") {
    // Internally rewrites http://greenshop.localhost:3000/about
    // to http://localhost:3000/sites/greenshop/about
    // But the browser URL remains http://greenshop.localhost:3000/about
    return NextResponse.rewrite(new URL(`/sites/${subdomain}${path}`, req.url));
  }

  // 4. Default flow: serve the standard admin panel routing (/, /login, /dashboard)
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
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
