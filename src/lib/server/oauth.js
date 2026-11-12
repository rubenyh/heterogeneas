// src/lib/server/oauth.js
"use server";

import crypto from "node:crypto";
import { createAdminClient } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { OAuthProvider } from "node-appwrite";

export async function signUpWithGithub() {
	const { account } = await createAdminClient();

  const origin = (await headers()).get("origin");

  // A random value only this browser will hold, checked in the callback
  const state = crypto.randomBytes(32).toString("hex");
  (await cookies()).set("oauth-state", state, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 600,
  });

	const redirectUrl = await account.createOAuth2Token({
		provider: OAuthProvider.Github,
		success: `${origin}/oauth`,
		failure: `${origin}/signup`,
		state: state,
	});

	return redirect(redirectUrl);
};
