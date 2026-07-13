import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { supabaseKey, supabaseUrl } from "./utils/supabase/supabase";

export async function middleware(request: NextRequest) {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  );

  const {
    data: {user},
  } = await supabase.auth.getUser();

  const isAuthPage = request.nextUrl.pathname === "/sign-in";

  // Not logged in ; block protected routes
  if (!user && !isAuthPage){
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Logged in ; block auth page
  if (user && isAuthPage){
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/", "/dashboard", "/sign-in"]
}
