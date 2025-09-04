import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getMasjidSubscriptionByMasjidId } from "./lib/server/data/masjidSubscription";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Match any /masjid/[id]/embed/* route
  if (pathname.startsWith("/masjid/") && pathname.includes("/embed/")) {
    const masjidId = req.nextUrl.pathname.split("/")[2];
    const subscription = await getMasjidSubscriptionByMasjidId(masjidId);
    const tier = subscription?.tier;

    if (tier === "free") {
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
  matcher: ["/masjid/:id/embed/:path*"],
};
