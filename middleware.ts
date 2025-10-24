import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getMasjidSubscriptionByMasjidId } from "./lib/server/services/masjidSubscription";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const masjidId = pathname.split("/")[2];

  // Skip static assets
  if (/\.(js|css|png|jpg|jpeg|svg|ico)$/.test(pathname)) {
    return NextResponse.next();
  }

  const subscription = await getMasjidSubscriptionByMasjidId(masjidId);
  const tier = subscription?.tier;

  const isCommunityFeature =
    pathname.includes("/embed/") ||
    pathname.includes("/layout/simple") ||
    pathname.includes("/layout/advanced");

  // 🚫 Restrict community-only access
  if (
    pathname.startsWith("/masjid/") &&
    isCommunityFeature &&
    tier === "starter"
  ) {
    const url = req.nextUrl.clone();
    url.pathname = `/masjid/${masjidId}/access-denied`;
    url.searchParams.set("plan", "starter");
    return NextResponse.redirect(url);
  }

  const isHubFeature =
  pathname.includes("/embed/youtube-feed") ||
  pathname.includes("/embed/donation/") ||
  pathname.includes("/embed/donations");

  // 🚫 Restrict hub-only access
  if (
    pathname.startsWith("/masjid/") &&
    isHubFeature &&
    (tier === "community" || tier === "starter")
  ) {
    const url = req.nextUrl.clone();
    url.pathname = `/masjid/${masjidId}/access-denied`;
    url.searchParams.set("plan", tier);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/masjid/:id/embed/:path*", "/masjid/:id/layout/:path*"],
};
