import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/health",
]);

export default clerkMiddleware(async (auth, request) => {
  const lang = request.nextUrl.searchParams.get("lang");

  if (isPublicRoute(request) && (lang === "ru" || lang === "en")) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("lang");

    const response = NextResponse.redirect(url);

    response.cookies.set("locale", lang, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
      secure: true,
    });

    return response;
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
