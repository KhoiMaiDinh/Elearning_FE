import { NextResponse } from "next/server";
import { i18n } from "../../i18n.config";

export function middleware(request: Request) {
  const pathname = new URL(request.url).pathname;

  const hasLocale = i18n.locales.some((locale) =>
    pathname.startsWith(`/${locale}`)
  );
  if (!hasLocale) {
    const locale = i18n.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
