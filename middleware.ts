import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getMasjidSubscriptionByMasjidId } from "./lib/server/services/masjidSubscription";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const masjidId = req.nextUrl.pathname.split("/")[2];

  // Check if this is a paid feature path
  const isCommunityFeature =
    pathname.includes("/embed/") || pathname.includes("/layout/");

  if (pathname.startsWith("/masjid/") && isCommunityFeature) {
    const subscription = await getMasjidSubscriptionByMasjidId(masjidId);

    if (subscription?.tier === "starter") {
      return new NextResponse(
        "You do not have access to this feature. Please upgrade to the Community plan to access this feature.",
        { status: 403 }
      );
    }
  }

  const isHubFeature = pathname.includes("/embed/youtube-feed/");

  if (pathname.startsWith("/masjid/") && isHubFeature) {
    const subscription = await getMasjidSubscriptionByMasjidId(masjidId);

    if (subscription?.tier === "community") {
      return new NextResponse(
        "You do not have access to this feature. Please upgrade to the Hub plan to access this feature.",
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

// Only run middleware on paths we care about
export const config = {
  matcher: ["/masjid/:id/embed/:path*", "/masjid/:id/layout/:path*"],
};
