// src/app/oauth/route.js

import { createAdminClient } from "@/lib/server/appwrite";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");
  const state = request.nextUrl.searchParams.get("state");

  // Only accept a sign-in this browser started
  const cookieStore = await cookies();
  const expected = cookieStore.get("oauth-state")?.value;
  cookieStore.delete("oauth-state");
  if (!expected || state !== expected) {
    return NextResponse.redirect(`${request.nextUrl.origin}/signup`);
  }

  const { account } = await createAdminClient();
  const session = await account.createSession({
    userId,
    secret
  });

  cookieStore.set("my-custom-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  return NextResponse.redirect(`${request.nextUrl.origin}/account`);
}
