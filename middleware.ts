import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getMasjidSubscriptionByMasjidId } from "./lib/server/services/masjidSubscription";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const masjidId = req.nextUrl.pathname.split("/")[2];

  // Check if this is a paid feature path
  const isPaidFeature =
    pathname.includes("/embed/") ||
    !pathname.includes("/prayer-screens/theme1") ||
    pathname.includes("/layout/advanced") ||
    pathname.includes("/layout/simple");

  if (pathname.startsWith("/masjid/") && isPaidFeature) {
    const subscription = await getMasjidSubscriptionByMasjidId(masjidId);

    if (subscription?.tier === "free") {
      return new NextResponse(
        "You do not have access to this feature. Please upgrade to a paid plan to access this feature.",
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

// Only run middleware on paths we care about
export const config = {
  matcher: [
    "/masjid/:id/embed/:path*",
    "/masjid/:id/prayer-screens/:path*",
    "/masjid/:id/layout/:path*",
  ],
};
