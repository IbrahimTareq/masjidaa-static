import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getMasjidSubscriptionByMasjidId } from "./lib/server/services/masjidSubscription";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const masjidId = req.nextUrl.pathname.split("/")[2];

  // Skip static and Next.js build assets
  if (/\.(js|css|png|jpg|jpeg|svg|ico)$/.test(pathname)) {
    return NextResponse.next();
  }

  const isCommunityFeature =
    pathname.includes("/embed/") || pathname.includes("/layout/");
  const isHubFeature = pathname.includes("/embed/youtube-feed/");

  if (pathname.startsWith("/masjid/") && isCommunityFeature) {
    const subscription = await getMasjidSubscriptionByMasjidId(masjidId);

    if (subscription?.tier === "starter") {
      return new NextResponse(
        "<html><body><h1>Access Denied</h1><p>Please upgrade to the Community plan.</p></body></html>",
        {
          status: 403,
          headers: { "content-type": "text/html" },
        }
      );
    }
  }

  if (pathname.startsWith("/masjid/") && isHubFeature) {
    const subscription = await getMasjidSubscriptionByMasjidId(masjidId);

    if (subscription?.tier === "community") {
      return new NextResponse(
        "<html><body><h1>Access Denied</h1><p>Please upgrade to the Hub plan.</p></body></html>",
        {
          status: 403,
          headers: { "content-type": "text/html" },
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/masjid/:id/embed/:path*",
    "/masjid/:id/layout/:path*",
  ],
};