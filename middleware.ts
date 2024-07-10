import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/api/webhook"]);

export default clerkMiddleware((auth, req) => {
  const { userId, orgId } = auth();

  // For public routes
  if (isPublicRoute(req)) {
    if (userId) {
      // Redirect logged-in users away from public routes
      const path = orgId ? `/organization/${orgId}` : "/select-org";
      return NextResponse.redirect(new URL(path, req.url));
    }
  } else {
    // This will redirect not logged-in user to sign-in page
    auth().protect();

    // Redirect logged-in user to select-org page if user don't have organization selected
    if (userId && !orgId && req.nextUrl.pathname !== "/select-org") {
      return NextResponse.redirect(new URL("/select-org", req.url));
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
