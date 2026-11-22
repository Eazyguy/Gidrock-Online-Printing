import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and anon key must be configured.");
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const path = request.nextUrl.pathname;
  const isLoginPage = path === "/dashboard/login";
  const isAdminRoute =
    path === "/dashboard/admin" ||
    path.startsWith("/dashboard/admin/") ||
    path === "/dashboard/users" ||
    path.startsWith("/dashboard/users/") ||
    path === "/dashboard/settings" ||
    path.startsWith("/dashboard/settings/");
  const isCashierRoute =
    path === "/dashboard/cashier" || path.startsWith("/dashboard/cashier/");

  const redirectWithCookies = (pathname: string) => {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.search = "";

    const response = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie);
    });
    return response;
  };

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Dashboard auth validation failed:", authError.message);
  }

  if (!user) {
    return isLoginPage
      ? supabaseResponse
      : redirectWithCookies("/dashboard/login");
  }

  if (!user.email) {
    return isLoginPage
      ? supabaseResponse
      : redirectWithCookies("/dashboard/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("email", user.email)
    .maybeSingle();

  if (profileError) {
    console.error("Dashboard profile lookup failed:", profileError.message);
    return isLoginPage
      ? supabaseResponse
      : redirectWithCookies("/dashboard/login");
  }

  if (!profile || (profile.role !== "admin" && profile.role !== "cashier")) {
    return isLoginPage
      ? supabaseResponse
      : redirectWithCookies("/dashboard/login");
  }

  if (isLoginPage) {
    return redirectWithCookies(
      profile.role === "admin" ? "/dashboard/admin" : "/dashboard/cashier",
    );
  }

  if (isAdminRoute && profile.role !== "admin") {
    return redirectWithCookies("/dashboard/cashier");
  }

  if (isCashierRoute && profile.role !== "cashier") {
    return redirectWithCookies("/dashboard/admin");
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
